# app/ml/models.py
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import GridSearchCV
import numpy as np
import pandas as pd
import joblib
import os
from typing import Dict, List, Tuple, Optional, Any
import logging

logger = logging.getLogger(__name__)

MODEL_TYPES = {
    "linear": {
        "model": LinearRegression,
        "params": {
            "fit_intercept": [True, False],
            "positive": [True, False]
        }
    },
    "ridge": {
        "model": Ridge,
        "params": {
            "alpha": [0.1, 1.0, 10.0, 100.0],
            "fit_intercept": [True, False]
        }
    },
    "lasso": {
        "model": Lasso,
        "params": {
            "alpha": [0.1, 1.0, 10.0, 100.0],
            "fit_intercept": [True, False]
        }
    },
    "random_forest": {
        "model": RandomForestRegressor,
        "params": {
            "n_estimators": [50, 100, 200],
            "max_depth": [None, 10, 20, 30],
            "min_samples_split": [2, 5, 10]
        }
    },
    "gradient_boosting": {
        "model": GradientBoostingRegressor,
        "params": {
            "n_estimators": [50, 100, 200],
            "learning_rate": [0.01, 0.1, 0.2],
            "max_depth": [3, 5, 7]
        }
    },
    "svr": {
        "model": SVR,
        "params": {
            "C": [0.1, 1.0, 10.0],
            "gamma": ["scale", "auto"],
            "kernel": ["linear", "rbf"]
        }
    }
}

class RecipeOptimizer:
    def __init__(self, model_type: str = "linear", model_dir: str = "./models"):
        self.model_type = model_type
        self.model_dir = model_dir
        self.model = None
        self.feature_names = None
        
        # Create model directory if it doesn't exist
        os.makedirs(model_dir, exist_ok=True)
    
    def _get_model_path(self, user_id: int, meal_id: int) -> str:
        """Generate path for saving/loading model."""
        return os.path.join(self.model_dir, f"user_{user_id}_meal_{meal_id}_{self.model_type}.joblib")
    
    def _get_feature_names_path(self, user_id: int, meal_id: int) -> str:
        """Generate path for saving/loading feature names."""
        return os.path.join(self.model_dir, f"user_{user_id}_meal_{meal_id}_features.joblib")
    
    def _prepare_data(self, recipes: List[Dict]) -> Tuple[pd.DataFrame, np.ndarray]:
        """
        Convert recipe data into feature matrix and target vector.
        Each recipe contains ingredients with quantities.
        """
        # Gather all unique ingredients across all recipes
        all_ingredients = set()
        for recipe in recipes:
            for ingredient in recipe["ingredients"]:
                # Create a unique key for each ingredient-unit combination
                key = f"{ingredient['ingredient_id']}_{ingredient['unit']}"
                all_ingredients.add(key)
        
        # Create mapping from ingredient keys to feature indices
        self.feature_names = {ing: i for i, ing in enumerate(sorted(all_ingredients))}
        
        # Prepare feature matrix X and target vector y
        X = np.zeros((len(recipes), len(self.feature_names)))
        y = np.zeros(len(recipes))
        
        for i, recipe in enumerate(recipes):
            y[i] = recipe["rating"]
            for ingredient in recipe["ingredients"]:
                key = f"{ingredient['ingredient_id']}_{ingredient['unit']}"
                if key in self.feature_names:
                    X[i, self.feature_names[key]] = ingredient["quantity"]
        
        return pd.DataFrame(X, columns=list(self.feature_names.keys())), y
    
    def train(self, recipes: List[Dict], user_id: int, meal_id: int) -> Dict[str, Any]:
        """
        Train model on recipe data.
        Return metrics on model performance.
        """
        if len(recipes) < 2:
            raise ValueError("Need at least 2 recipes to train a model")
        
        X, y = self._prepare_data(recipes)
        
        # Create pipeline with standardization and the selected model
        model_info = MODEL_TYPES[self.model_type]
        pipeline = Pipeline([
            ('scaler', StandardScaler()),
            ('model', model_info["model"]())
        ])
        
        # Use grid search to find best parameters
        grid_search = GridSearchCV(
            pipeline,
            param_grid={f"model__{k}": v for k, v in model_info["params"].items()},
            cv=min(5, len(recipes)),  # Adjust cross-validation based on available data
            scoring='neg_mean_squared_error'
        )
        
        # Train model
        if len(X) > 0 and len(X.columns) > 0:
            try:
                grid_search.fit(X, y)
                self.model = grid_search.best_estimator_
                
                # Save model and feature names
                joblib.dump(self.model, self._get_model_path(user_id, meal_id))
                joblib.dump(self.feature_names, self._get_feature_names_path(user_id, meal_id))
                
                # Return metrics
                return {
                    "best_score": -grid_search.best_score_,  # Convert back from negative MSE
                    "best_params": grid_search.best_params_,
                    "feature_count": len(self.feature_names),
                    "sample_count": len(recipes)
                }
            except Exception as e:
                logger.error(f"Error training model: {e}")
                raise
        else:
            raise ValueError("No features available for training")
    
    def load(self, user_id: int, meal_id: int) -> bool:
        """Load a trained model if it exists."""
        model_path = self._get_model_path(user_id, meal_id)
        features_path = self._get_feature_names_path(user_id, meal_id)
        
        try:
            if os.path.exists(model_path) and os.path.exists(features_path):
                self.model = joblib.load(model_path)
                self.feature_names = joblib.load(features_path)
                return True
            return False
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False
    
    def predict(self, recipe_ingredients: List[Dict]) -> float:
        """Predict rating for a recipe based on its ingredients."""
        if self.model is None or self.feature_names is None:
            raise ValueError("Model not trained or loaded")
        
        # Create feature vector
        X = np.zeros((1, len(self.feature_names)))
        for ingredient in recipe_ingredients:
            key = f"{ingredient['ingredient_id']}_{ingredient['unit']}"
            if key in self.feature_names:
                X[0, self.feature_names[key]] = ingredient["quantity"]
        
        # Make prediction
        prediction = self.model.predict(X)[0]
        
        # Clamp prediction to valid range (1-10)
        return max(1.0, min(10.0, prediction))
    
    def optimize_recipe(self, recipe_ingredients: List[Dict], 
                       min_adjustment: float = 0.8, 
                       max_adjustment: float = 1.2) -> Tuple[List[Dict], float, float]:
        """
        Optimize a recipe by adjusting ingredient quantities to maximize predicted rating.
        Returns optimized ingredients, predicted rating, and confidence.
        """
        if self.model is None or self.feature_names is None:
            raise ValueError("Model not trained or loaded")
        
        # Create starting feature vector from current recipe
        X_base = np.zeros((1, len(self.feature_names)))
        for ingredient in recipe_ingredients:
            key = f"{ingredient['ingredient_id']}_{ingredient['unit']}"
            if key in self.feature_names:
                X_base[0, self.feature_names[key]] = ingredient["quantity"]
        
        # Get base prediction
        base_prediction = self.model.predict(X_base)[0]
        
        # Try different adjustments to find the best one
        best_adjustments = {}
        best_prediction = base_prediction
        
        # For each ingredient, try different adjustments
        for ingredient in recipe_ingredients:
            key = f"{ingredient['ingredient_id']}_{ingredient['unit']}"
            if key not in self.feature_names:
                continue
            
            idx = self.feature_names[key]
            original_quantity = ingredient["quantity"]
            
            # Try different adjustment factors
            adjustments = np.linspace(min_adjustment, max_adjustment, 10)
            for adj in adjustments:
                # Apply adjustment
                X_adjusted = X_base.copy()
                X_adjusted[0, idx] = original_quantity * adj
                
                # Predict rating
                prediction = self.model.predict(X_adjusted)[0]
                
                # If better than current best, update
                if prediction > best_prediction:
                    best_prediction = prediction
                    best_adjustments[key] = adj
        
        # Apply best adjustments to create optimized recipe
        optimized_ingredients = []
        for ingredient in recipe_ingredients:
            key = f"{ingredient['ingredient_id']}_{ingredient['unit']}"
            new_ingredient = ingredient.copy()
            if key in best_adjustments:
                new_ingredient["quantity"] = ingredient["quantity"] * best_adjustments[key]
            optimized_ingredients.append(new_ingredient)
        
        # Calculate confidence based on number of recipes used for training
        # This is a simplified confidence measure
        model_pipeline = self.model
        if hasattr(model_pipeline, 'steps') and len(model_pipeline.steps) > 1:
            model = model_pipeline.steps[-1][1]  # Get the actual model from pipeline
            if hasattr(model, 'n_samples_seen_'):
                confidence = min(0.95, 0.5 + (model.n_samples_seen_ / 20))
            else:
                confidence = 0.7  # Default if we can't determine from model
        else:
            confidence = 0.7
        
        # Clamp predicted rating to valid range (1-10)
        best_prediction = max(1.0, min(10.0, best_prediction))
        
        return optimized_ingredients, best_prediction, confidence
    
    def analyze_ingredient_influence(self, recipes: List[Dict]) -> List[Dict]:
        """
        Analyze the influence of each ingredient on the recipe rating.
        """
        if len(recipes) < 2:
            raise ValueError("Need at least 2 recipes to analyze ingredient influence")
        
        X, y = self._prepare_data(recipes)
        
        # Train a simple linear model to get coefficients
        model = LinearRegression()
        model.fit(X, y)
        
        # Get feature importance from coefficients
        influences = []
        inverse_feature_names = {v: k for k, v in self.feature_names.items()}
        
        for i, coef in enumerate(model.coef_):
            if i < len(inverse_feature_names):
                feature_key = inverse_feature_names[i]
                ingredient_id, unit = feature_key.split('_')
                
                # Find ingredient name
                ingredient_name = None
                for recipe in recipes:
                    for ingredient in recipe["ingredients"]:
                        if str(ingredient["ingredient_id"]) == ingredient_id:
                            ingredient_name = ingredient.get("ingredient_name", "Unknown")
                            break
                    if ingredient_name:
                        break
                
                influences.append({
                    "ingredient_id": int(ingredient_id),
                    "ingredient_name": ingredient_name or "Unknown",
                    "unit": unit,
                    "influence": coef
                })
        
        # Sort by absolute influence
        influences.sort(key=lambda x: abs(x["influence"]), reverse=True)
        
        return influences

# app/ml/training.py
from typing import List, Dict, Any
from app.ml.models import RecipeOptimizer
from app.db.session import SessionLocal
from app.models.recipe import Recipe, RecipeIngredient
from app.models.ingredient import Ingredient
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

def get_recipes_data_for_meal(db: Session, meal_id: int) -> List[Dict[str, Any]]:
    """Get recipe data for a specific meal in the format needed for ML."""
    recipes = db.query(Recipe).filter(Recipe.meal_id == meal_id).all()
    
    recipes_data = []
    for recipe in recipes:
        # Get recipe ingredients with ingredient names
        ingredients_data = []
        for ri in recipe.ingredients:
            ingredient = db.query(Ingredient).filter(Ingredient.id == ri.ingredient_id).first()
            ingredient_name = ingredient.name if ingredient else "Unknown"
            
            ingredients_data.append({
                "ingredient_id": ri.ingredient_id,
                "ingredient_name": ingredient_name,
                "quantity": ri.quantity,
                "unit": ri.unit
            })
        
        recipes_data.append({
            "id": recipe.id,
            "rating": recipe.rating,
            "ingredients": ingredients_data
        })
    
    return recipes_data

def train_model_for_meal(meal_id: int, user_id: int, model_type: str = "random_forest") -> Dict[str, Any]:
    """Train a model for a specific meal."""
    try:
        db = SessionLocal()
        recipes_data = get_recipes_data_for_meal(db, meal_id)
        
        if len(recipes_data) < 2:
            return {
                "success": False,
                "error": "Need at least 2 recipes to train a model",
                "status_code": 400
            }
        
        optimizer = RecipeOptimizer(model_type=model_type)
        metrics = optimizer.train(recipes_data, user_id, meal_id)
        
        return {
            "success": True,
            "metrics": metrics,
            "model_type": model_type
        }
    except Exception as e:
        logger.error(f"Error training model: {e}")
        return {
            "success": False,
            "error": str(e),
            "status_code": 500
        }
    finally:
        db.close()

# app/ml/prediction.py
from typing import List, Dict, Any, Optional, Tuple
from app.ml.models import RecipeOptimizer
from app.db.session import SessionLocal
from app.models.recipe import Recipe, RecipeIngredient
from app.models.ingredient import Ingredient
from app.models.meal import Meal
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

def predict_recipe_rating(recipe_ingredients: List[Dict], user_id: int, meal_id: int, model_type: str = "random_forest") -> Dict[str, Any]:
    """Predict rating for a recipe based on its ingredients."""
    try:
        optimizer = RecipeOptimizer(model_type=model_type)
        
        # Try to load existing model
        if not optimizer.load(user_id, meal_id):
            # If model doesn't exist, train a new one
            db = SessionLocal()
            recipes_data = get_recipes_data_for_meal(db, meal_id)
            db.close()
            
            if len(recipes_data) < 2:
                return {
                    "success": False,
                    "error": "Need at least 2 recipes to train a model",
                    "status_code": 400
                }
            
            optimizer.train(recipes_data, user_id, meal_id)
        
        # Predict rating
        predicted_rating = optimizer.predict(recipe_ingredients)
        
        return {
            "success": True,
            "predicted_rating": predicted_rating
        }
    except Exception as e:
        logger.error(f"Error predicting recipe rating: {e}")
        return {
            "success": False,
            "error": str(e),
            "status_code": 500
        }

def optimize_recipe(recipe_id: int, user_id: int, model_type: str = "random_forest") -> Dict[str, Any]:
    """Optimize a recipe by adjusting ingredient quantities."""
    try:
        db = SessionLocal()
        
        # Get recipe and its meal
        recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
        if not recipe:
            db.close()
            return {
                "success": False,
                "error": "Recipe not found",
                "status_code": 404
            }
        
        meal_id = recipe.meal_id
        meal = db.query(Meal).filter(Meal.id == meal_id).first()
        
        # Check if meal belongs to user
        if meal.user_id != user_id:
            db.close()
            return {
                "success": False,
                "error": "Not authorized to access this meal",
                "status_code": 403
            }
        
        # Get recipe ingredients with ingredient names
        recipe_ingredients = []
        for ri in recipe.ingredients:
            ingredient = db.query(Ingredient).filter(Ingredient.id == ri.ingredient_id).first()
            ingredient_name = ingredient.name if ingredient else "Unknown"
            
            recipe_ingredients.append({
                "ingredient_id": ri.ingredient_id,
                "ingredient_name": ingredient_name,
                "quantity": ri.quantity,
                "unit": ri.unit
            })
        
        # Try to load existing model
        optimizer = RecipeOptimizer(model_type=model_type)
        if not optimizer.load(user_id, meal_id):
            # If model doesn't exist, train a new one
            recipes_data = get_recipes_data_for_meal(db, meal_id)
            
            if len(recipes_data) < 2:
                db.close()
                return {
                    "success": False,
                    "error": "Need at least 2 recipes to train a model",
                    "status_code": 400
                }
            
            optimizer.train(recipes_data, user_id, meal_id)
        
        # Optimize recipe
        optimized_ingredients, predicted_rating, confidence = optimizer.optimize_recipe(recipe_ingredients)
        
        db.close()
        
        return {
            "success": True,
            "optimized_ingredients": optimized_ingredients,
            "predicted_rating": predicted_rating,
            "confidence": confidence
        }
    except Exception as e:
        logger.error(f"Error optimizing recipe: {e}")
        if 'db' in locals():
            db.close()
        return {
            "success": False,
            "error": str(e),
            "status_code": 500
        }

def analyze_ingredient_influence(meal_id: int, user_id: int, model_type: str = "linear") -> Dict[str, Any]:
    """Analyze the influence of each ingredient on the recipe rating."""
    try:
        db = SessionLocal()
        
        # Check if meal belongs to user
        meal = db.query(Meal).filter(Meal.id == meal_id).first()
        if not meal:
            db.close()
            return {
                "success": False,
                "error": "Meal not found",
                "status_code": 404
            }
        
        if meal.user_id != user_id:
            db.close()
            return {
                "success": False,
                "error": "Not authorized to access this meal",
                "status_code": 403
            }
        
        # Get recipe data
        recipes_data = get_recipes_data_for_meal(db, meal_id)
        
        if len(recipes_data) < 2:
            db.close()
            return {
                "success": False,
                "error": "Need at least 2 recipes to analyze ingredient influence",
                "status_code": 400
            }
        
        # Use linear model for coefficient analysis
        optimizer = RecipeOptimizer(model_type="linear")
        optimizer.train(recipes_data, user_id, meal_id)
        
        # Analyze ingredient influence
        influences = optimizer.analyze_ingredient_influence(recipes_data)
        
        db.close()
        
        return {
            "success": True,
            "influences": influences
        }
    except Exception as e:
        logger.error(f"Error analyzing ingredient influence: {e}")
        if 'db' in locals():
            db.close()
        return {
            "success": False,
            "error": str(e),
            "status_code": 500
        }

def get_recipes_data_for_meal(db: Session, meal_id: int) -> List[Dict[str, Any]]:
    """Get recipe data for a specific meal in the format needed for ML."""
    recipes = db.query(Recipe).filter(Recipe.meal_id == meal_id).all()
    
    recipes_data = []
    for recipe in recipes:
        # Get recipe ingredients with ingredient names
        ingredients_data = []
        for ri in recipe.ingredients:
            ingredient = db.query(Ingredient).filter(Ingredient.id == ri.ingredient_id).first()
            ingredient_name = ingredient.name if ingredient else "Unknown"
            
            ingredients_data.append({
                "ingredient_id": ri.ingredient_id,
                "ingredient_name": ingredient_name,
                "quantity": ri.quantity,
                "unit": ri.unit
            })
        
        recipes_data.append({
            "id": recipe.id,
            "rating": recipe.rating,
            "ingredients": ingredients_data
        })
    
    return recipes_data