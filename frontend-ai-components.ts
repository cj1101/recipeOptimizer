// src/components/ai/RecipeSuggestion.tsx
import React, { useState, useEffect } from 'react';
import { useRecipes } from '../../hooks/useRecipes';
import { Recipe } from '../../types/recipe.types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Rating from '../ui/Rating';
import * as mlService from '../../services/mlService';

interface RecipeSuggestionProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  mealId: number;
}

const RecipeSuggestion: React.FC<RecipeSuggestionProps> = ({
  isOpen,
  onClose,
  recipes,
  mealId,
}) => {
  const { createRecipe } = useRecipes();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizedIngredients, setOptimizedIngredients] = useState<Recipe['ingredients']>([]);
  const [predictedRating, setPredictedRating] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [notes, setNotes] = useState('');
  const [userRating, setUserRating] = useState(7);
  const [saving, setSaving] = useState(false);
  
  // Find the best recipe to optimize
  useEffect(() => {
    if (isOpen && recipes.length >= 2) {
      const bestRecipe = [...recipes].sort((a, b) => b.rating - a.rating)[0];
      setSelectedRecipe(bestRecipe);
    }
  }, [isOpen, recipes]);
  
  // Generate AI suggestion
  useEffect(() => {
    const generateSuggestion = async () => {
      if (!selectedRecipe) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const result = await mlService.optimizeRecipe(selectedRecipe.id);
        
        setOptimizedIngredients(result.optimized_ingredients);
        setPredictedRating(result.predicted_rating);
        setConfidence(result.confidence);
        setNotes(`This is an AI-generated recipe based on your previous ratings. The AI predicts a rating of ${result.predicted_rating.toFixed(1)} with ${(result.confidence * 100).toFixed()}% confidence.`);
      } catch (err) {
        console.error('Failed to optimize recipe:', err);
        setError('Failed to generate recipe suggestion. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedRecipe && isOpen) {
      generateSuggestion();
    }
  }, [selectedRecipe, isOpen]);
  
  const handleSave = async () => {
    if (!optimizedIngredients.length) return;
    
    try {
      setSaving(true);
      
      await createRecipe({
        mealId,
        ingredients: optimizedIngredients.map(ing => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unit: ing.unit,
        })),
        rating: userRating,
        notes,
      });
      
      onClose();
    } catch (err) {
      console.error('Failed to save recipe:', err);
      setError('Failed to save recipe. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Recipe Suggestion"
      size="lg"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg text-gray-700">Generating optimized recipe...</p>
        </div>
      ) : error ? (
        <div className="py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-accent-50 border-l-4 border-accent p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-accent-700">
                  This AI-generated recipe has an estimated rating of{' '}
                  <span className="font-bold">{predictedRating.toFixed(1)}</span>{' '}
                  with a confidence of{' '}
                  <span className="font-bold">{(confidence * 100).toFixed()}%</span>.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Suggested Ingredients</h3>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {optimizedIngredients.map((ingredient, index) => {
                  // Find the original ingredient in the source recipe
                  const originalIngredient = selectedRecipe?.ingredients.find(
                    i => i.ingredientId === ingredient.ingredientId && i.unit === ingredient.unit
                  );
                  
                  // Calculate the change percentage
                  const percentChange = originalIngredient
                    ? ((ingredient.quantity - originalIngredient.quantity) / originalIngredient.quantity) * 100
                    : 0;
                  
                  return (
                    <li key={index} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">{ingredient.quantity.toFixed(1)}</span>
                          <span className="ml-1 text-gray-500">{ingredient.unit}</span>
                          <span className="ml-2">{ingredient.ingredientName}</span>
                        </div>
                        
                        {originalIngredient && (
                          <div className={`text-sm font-medium ${
                            percentChange > 0 
                              ? 'text-green-600' 
                              : percentChange < 0 
                                ? 'text-red-600' 
                                : 'text-gray-500'
                          }`}>
                            {percentChange !== 0 && (
                              <span className="flex items-center">
                                {percentChange > 0 ? (
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {Math.abs(percentChange).toFixed(0)}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your Rating</h3>
            <Rating value={userRating} onChange={setUserRating} max={10} size="lg" />
            <p className="mt-1 text-sm text-gray-500">
              Rate this recipe after trying it.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={saving}
            >
              Save Recipe
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RecipeSuggestion;

// src/components/ai/IngredientInfluenceChart.tsx
import React, { useState, useEffect } from 'react';
import { useRecipes } from '../../hooks/useRecipes';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as mlService from '../../services/mlService';

interface IngredientInfluenceChartProps {
  isOpen: boolean;
  onClose: () => void;
  mealId: number;
}

const IngredientInfluenceChart: React.FC<IngredientInfluenceChartProps> = ({
  isOpen,
  onClose,
  mealId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [influences, setInfluences] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || !mealId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await mlService.analyzeIngredientInfluence(mealId);
        
        // Format data for the chart
        const formattedData = data.influences.map(item => ({
          name: item.ingredient_name,
          influence: parseFloat(item.influence.toFixed(2)),
          unit: item.unit,
        }));
        
        setInfluences(formattedData);
      } catch (err) {
        console.error('Failed to analyze ingredients:', err);
        setError('Failed to analyze ingredient influence. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isOpen, mealId]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-bold">{data.name}</p>
          <p>
            <span className="font-medium">Influence:</span>{' '}
            <span className={data.influence > 0 ? 'text-green-600' : 'text-red-600'}>
              {data.influence > 0 ? '+' : ''}{data.influence.toFixed(2)}
            </span>
          </p>
          <p className="text-gray-500 text-sm">Unit: {data.unit}</p>
          <p className="text-gray-500 text-sm mt-1">
            {data.influence > 0
              ? 'Higher quantities of this ingredient tend to increase ratings'
              : 'Higher quantities of this ingredient tend to decrease ratings'}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ingredient Influence Analysis"
      size="xl"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg text-gray-700">Analyzing ingredients...</p>
        </div>
      ) : error ? (
        <div className="py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700">
              This chart shows how each ingredient influences the recipe rating.
              <strong className="ml-1">Positive values</strong> (green) indicate that increasing the amount of the ingredient tends to increase ratings, while
              <strong className="ml-1">negative values</strong> (red) suggest that decreasing the amount may improve ratings.
            </p>
          </div>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={influences}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  label={{ 
                    value: 'Rating Influence', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="influence" 
                  name="Influence on Rating" 
                  fill={(data) => (data.influence >= 0 ? '#10B981' : '#EF4444')}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>How to use this:</strong> Consider adjusting ingredient quantities based on their influence. 
                  Increase ingredients with positive influence and decrease those with negative influence for potentially better results.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default IngredientInfluenceChart;
