# app/api/endpoints/ml.py
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import dependencies
from app.core.security import get_current_user
from app.ml import training, prediction
from app.schemas.ml import IngredientInfluence, RecipeSuggestion
from app.schemas.recipe import RecipeIngredient, RecipeCreate
from app.services import recipe as recipe_service
from app.models.user import User

router = APIRouter()

@router.post("/train/{meal_id}", response_model=dict)
def train_model(
    meal_id: int,
    model_type: str = "random_forest",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(dependencies.get_db)
) -> Any:
    """
    Train a ML model for a specific meal.
    """
    # Verify meal belongs to current user
    meal = db.query("Meal").filter(id=meal_id, user_id=current_user.id).first()
    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found or doesn't belong to current user"
        )
    
    result = training.train_model_for_meal(meal_id, current_user.id, model_type)
    
    if not result["success"]:
        raise HTTPException(
            status_code=result.get("status_code", status.HTTP_400_BAD_REQUEST),
            detail=result.get("error", "Failed to train model")
        )
    
    return result

@router.post("/optimize-recipe/{recipe_id}", response_model=dict)
def optimize_recipe(
    recipe_id: int,
    model_type: str = "random_forest",
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Optimize a recipe by adjusting ingredient quantities.
    """
    result = prediction.optimize_recipe(recipe_id, current_user.id, model_type)
    
    if not result["success"]:
        raise HTTPException(
            status_code=result.get("status_code", status.HTTP_400_BAD_REQUEST),
            detail=result.get("error", "Failed to optimize recipe")
        )
    
    return result

@router.post("/save-optimized-recipe", response_model=dict)
def save_optimized_recipe(
    recipe: RecipeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(dependencies.get_db)
) -> Any:
    """
    Save an optimized recipe as a new recipe.
    """
    # Set AI generated flag
    recipe_dict = recipe.dict()
    recipe_dict["is_ai_generated"] = True
    
    # Create the recipe
    try:
        new_recipe = recipe_service.create_recipe(db, recipe_dict, current_user.id)
        return {
            "success": True,
            "recipe_id": new_recipe.id
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to save recipe: {str(e)}"
        )

@router.get("/analyze-ingredients/{meal_id}", response_model=dict)
def analyze_ingredient_influence(
    meal_id: int,
    model_type: str = "linear",
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Analyze the influence of each ingredient on the recipe rating.
    """
    result = prediction.analyze_ingredient_influence(meal_id, current_user.id, model_type)
    
    if not result["success"]:
        raise HTTPException(
            status_code=result.get("status_code", status.HTTP_400_BAD_REQUEST),
            detail=result.get("error", "Failed to analyze ingredient influence")
        )
    
    return result

@router.post("/predict-rating", response_model=dict)
def predict_recipe_rating(
    recipe_ingredients: List[RecipeIngredient],
    meal_id: int,
    model_type: str = "random_forest",
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Predict rating for a recipe based on its ingredients.
    """
    ingredients_data = [ingredient.dict() for ingredient in recipe_ingredients]
    
    result = prediction.predict_recipe_rating(ingredients_data, current_user.id, meal_id, model_type)
    
    if not result["success"]:
        raise HTTPException(
            status_code=result.get("status_code", status.HTTP_400_BAD_REQUEST),
            detail=result.get("error", "Failed to predict recipe rating")
        )
    
    return result
