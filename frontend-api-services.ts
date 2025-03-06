// src/services/api.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { User } from '../types/auth.types';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle unauthorized error (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Handle token refresh or redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;

// src/services/authService.ts
import api from './api';
import { User, LoginCredentials, RegisterData } from '../types/auth.types';

export const login = async (credentials: LoginCredentials): Promise<string> => {
  // Convert to form data format expected by backend
  const formData = new FormData();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  
  const response = await api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  return response.data.access_token;
};

export const register = async (data: RegisterData): Promise<User> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put('/users/me', data);
  return response.data;
};

export const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/users/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.profile_image;
};

// src/services/mealService.ts
import api from './api';
import { Meal, MealFormData } from '../types/meal.types';
import { SortOption } from '../types/common.types';

export const getMeals = async (
  search?: string,
  sort?: SortOption,
  page = 1,
  limit = 20
): Promise<Meal[]> => {
  const params = new URLSearchParams();
  
  if (search) params.append('search', search);
  if (sort) params.append('sort', sort);
  
  params.append('skip', ((page - 1) * limit).toString());
  params.append('limit', limit.toString());
  
  const response = await api.get(`/meals?${params.toString()}`);
  return response.data;
};

export const getMeal = async (id: number): Promise<Meal> => {
  const response = await api.get(`/meals/${id}`);
  return response.data;
};

export const createMeal = async (data: MealFormData): Promise<Meal> => {
  const response = await api.post('/meals', data);
  return response.data;
};

export const updateMeal = async (id: number, data: MealFormData): Promise<Meal> => {
  const response = await api.put(`/meals/${id}`, data);
  return response.data;
};

export const deleteMeal = async (id: number): Promise<void> => {
  await api.delete(`/meals/${id}`);
};

// src/services/recipeService.ts
import api from './api';
import { Recipe, RecipeFormData } from '../types/recipe.types';
import { SortOption } from '../types/common.types';

export const getRecipesByMeal = async (
  mealId: number,
  sort?: SortOption,
  page = 1,
  limit = 20
): Promise<Recipe[]> => {
  const params = new URLSearchParams();
  
  if (sort) params.append('sort', sort);
  
  params.append('skip', ((page - 1) * limit).toString());
  params.append('limit', limit.toString());
  
  const response = await api.get(`/recipes/meal/${mealId}?${params.toString()}`);
  return response.data;
};

export const getRecipe = async (id: number): Promise<Recipe> => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

export const createRecipe = async (data: RecipeFormData): Promise<Recipe> => {
  const response = await api.post('/recipes', data);
  return response.data;
};

export const updateRecipe = async (id: number, data: Partial<RecipeFormData>): Promise<Recipe> => {
  const response = await api.put(`/recipes/${id}`, data);
  return response.data;
};

export const rateRecipe = async (id: number, rating: number): Promise<Recipe> => {
  const response = await api.post(`/recipes/${id}/rate?rating=${rating}`);
  return response.data;
};

export const deleteRecipe = async (id: number): Promise<void> => {
  await api.delete(`/recipes/${id}`);
};

// src/services/ingredientService.ts
import api from './api';
import { Ingredient, IngredientFormData } from '../types/ingredient.types';

export const getIngredients = async (
  search?: string,
  includePublic = true,
  page = 1,
  limit = 100
): Promise<Ingredient[]> => {
  const params = new URLSearchParams();
  
  if (search) params.append('search', search);
  params.append('include_public', includePublic.toString());
  params.append('skip', ((page - 1) * limit).toString());
  params.append('limit', limit.toString());
  
  const response = await api.get(`/ingredients?${params.toString()}`);
  return response.data;
};

export const getIngredient = async (id: number): Promise<Ingredient> => {
  const response = await api.get(`/ingredients/${id}`);
  return response.data;
};

export const createIngredient = async (data: IngredientFormData): Promise<Ingredient> => {
  const response = await api.post('/ingredients', data);
  return response.data;
};

export const updateIngredient = async (id: number, data: IngredientFormData): Promise<Ingredient> => {
  const response = await api.put(`/ingredients/${id}`, data);
  return response.data;
};

export const deleteIngredient = async (id: number): Promise<void> => {
  await api.delete(`/ingredients/${id}`);
};

// src/services/mlService.ts
import api from './api';
import { RecipeIngredient } from '../types/recipe.types';
import { IngredientInfluence, RecipeSuggestion } from '../types/ml.types';

export const optimizeRecipe = async (
  recipeId: number,
  modelType = 'random_forest'
): Promise<{
  optimized_ingredients: RecipeIngredient[];
  predicted_rating: number;
  confidence: number;
}> => {
  const params = new URLSearchParams();
  params.append('model_type', modelType);
  
  const response = await api.post(`/ml/optimize-recipe/${recipeId}?${params.toString()}`);
  return response.data;
};

export const saveOptimizedRecipe = async (
  data: RecipeFormData
): Promise<{ success: boolean; recipe_id: number }> => {
  const response = await api.post('/ml/save-optimized-recipe', data);
  return response.data;
};

export const analyzeIngredientInfluence = async (
  mealId: number,
  modelType = 'linear'
): Promise<{ influences: IngredientInfluence[] }> => {
  const params = new URLSearchParams();
  params.append('model_type', modelType);
  
  const response = await api.get(`/ml/analyze-ingredients/${mealId}?${params.toString()}`);
  return response.data;
};

export const predictRecipeRating = async (
  ingredients: RecipeIngredient[],
  mealId: number,
  modelType = 'random_forest'
): Promise<{ predicted_rating: number }> => {
  const params = new URLSearchParams();
  params.append('meal_id', mealId.toString());
  params.append('model_type', modelType);
  
  const response = await api.post('/ml/predict-rating', ingredients, {
    params,
  });
  
  return response.data;
};

// src/services/socialService.ts
import api from './api';
import { Recipe } from '../types/recipe.types';

export const createShareLink = async (recipeId: number): Promise<{ share_token: string }> => {
  const response = await api.post(`/social/share/${recipeId}`);
  return response.data;
};

export const getSharedRecipe = async (token: string): Promise<{
  recipe: Recipe;
  meal_name: string;
  shared_by: string;
}> => {
  const response = await api.get(`/social/shared/${token}`);
  return response.data;
};

export const deleteShareLink = async (shareId: number): Promise<void> => {
  await api.delete(`/social/share/${shareId}`);
};
