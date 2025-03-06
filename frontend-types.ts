// src/types/auth.types.ts
export interface User {
  id: number;
  username: string;
  email: string;
  profileImage?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// src/types/meal.types.ts
export interface Meal {
  id: number;
  name: string;
  userId: number;
  recipeCount: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface MealFormData {
  name: string;
}

// src/types/recipe.types.ts
export enum MeasurementUnit {
  // Weight
  GRAM = 'g',
  KILOGRAM = 'kg',
  OUNCE = 'oz',
  POUND = 'lb',
  
  // Volume
  MILLILITER = 'ml',
  LITER = 'L',
  TEASPOON = 'tsp',
  TABLESPOON = 'tbsp',
  FLUID_OUNCE = 'fl oz',
  CUP = 'cup',
  PINT = 'pint',
  QUART = 'quart',
  GALLON = 'gallon',
  
  // Count
  UNIT = 'unit(s)',
  PIECE = 'piece(s)',
  PINCH = 'pinch'
}

export interface RecipeIngredient {
  id: number;
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: MeasurementUnit;
}

export interface Recipe {
  id: number;
  mealId: number;
  ingredients: RecipeIngredient[];
  rating: number;
  notes: string;
  isAiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeFormData {
  mealId: number;
  ingredients: {
    ingredientId: number;
    quantity: number;
    unit: MeasurementUnit;
  }[];
  rating: number;
  notes: string;
}

// src/types/ingredient.types.ts
export interface Ingredient {
  id: number;
  name: string;
  userId: number;
  isPublic: boolean;
  createdAt: string;
}

export interface IngredientFormData {
  name: string;
  isPublic: boolean;
}

// src/types/common.types.ts
export enum SortOption {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  RATING_HIGH = 'rating_high',
  RATING_LOW = 'rating_low',
  DATE_NEWEST = 'date_newest',
  DATE_OLDEST = 'date_oldest'
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  details?: string;
}

// src/types/ml.types.ts
export interface IngredientInfluence {
  ingredientId: number;
  ingredientName: string;
  unit: MeasurementUnit;
  influence: number;
}

export interface RecipeSuggestion {
  id: number;
  mealId: number;
  ingredients: RecipeIngredient[];
  predictedRating: number;
  confidence: number;
  createdAt: string;
}
