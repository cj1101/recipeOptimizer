// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const { authState } = useAuth();
  const { isAuthenticated } = authState;

  return (
    <div className="bg-gradient-to-b from-primary-dark to-primary min-h-screen flex flex-col justify-center items-center text-white p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Optimize Your Recipes with Machine Learning
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Track, rate, and improve your recipes using AI-powered suggestions
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-sm">
            <svg 
              className="w-12 h-12 mx-auto mb-4 text-accent" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-bold mb-2">Track Your Recipes</h3>
            <p className="text-white text-opacity-80">
              Keep all your recipes organized in one place, with detailed ingredient lists.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-sm">
            <svg 
              className="w-12 h-12 mx-auto mb-4 text-accent" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">Rate & Refine</h3>
            <p className="text-white text-opacity-80">
              Rate your recipes from 1-10 and iterate to find the perfect balance of ingredients.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-sm">
            <svg 
              className="w-12 h-12 mx-auto mb-4 text-accent" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">AI-Powered Optimization</h3>
            <p className="text-white text-opacity-80">
              Get intelligent suggestions to improve your recipes based on your ratings.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/meals">
              <Button variant="accent" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="accent" size="lg">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

// src/pages/LoginPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-dark to-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-md text-white text-opacity-80">
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-accent hover:text-accent-dark"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;

// src/pages/RegisterPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-dark to-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-md text-white text-opacity-80">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-accent hover:text-accent-dark"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;

// src/pages/ForgotPasswordPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-dark to-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-md text-white text-opacity-80">
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-medium text-accent hover:text-accent-dark"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

// src/pages/MealsPage.tsx
import React, { useEffect } from 'react';
import { useRecipes } from '../hooks/useRecipes';
import MealList from '../components/meals/MealList';

const MealsPage: React.FC = () => {
  const { fetchMeals, clearRecipes } = useRecipes();
  
  useEffect(() => {
    fetchMeals();
    clearRecipes();
  }, [fetchMeals, clearRecipes]);
  
  return (
    <div className="py-6">
      <MealList />
    </div>
  );
};

export default MealsPage;

// src/pages/MealDetailPage.tsx
import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import RecipeList from '../components/recipes/RecipeList';

const MealDetailPage: React.FC = () => {
  const { mealId } = useParams<{ mealId: string }>();
  const { fetchRecipesByMeal, meals } = useRecipes();
  
  useEffect(() => {
    if (mealId) {
      fetchRecipesByMeal(parseInt(mealId));
    }
  }, [mealId, fetchRecipesByMeal]);
  
  // Check if meal exists
  const mealExists = meals.some(meal => meal.id === parseInt(mealId || '0'));
  
  if (!mealId || !mealExists) {
    return <Navigate to="/meals" />;
  }
  
  return (
    <div className="py-6">
      <RecipeList />
    </div>
  );
};

export default MealDetailPage;

// src/pages/IngredientsPage.tsx
import React, { useEffect, useState } from 'react';
import { useRecipes } from '../hooks/useRecipes';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import { Ingredient } from '../types/ingredient.types';

const IngredientsPage: React.FC = () => {
  const { fetchIngredients, ingredients, createIngredient, deleteIngredient } = useRecipes();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [newIngredientName, setNewIngredientName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);
  
  const filteredIngredients = searchTerm
    ? ingredients.filter(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : ingredients;
  
  const handleCreateIngredient = async () => {
    if (!newIngredientName.trim()) return;
    
    try {
      setLoading(true);
      await createIngredient(newIngredientName, isPublic);
      setNewIngredientName('');
      setIsPublic(false);
    } catch (error) {
      console.error('Failed to create ingredient:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteIngredient = async (ingredient: Ingredient) => {
    if (window.confirm(`Are you sure you want to delete ${ingredient.name}?`)) {
      try {
        await deleteIngredient(ingredient.id);
      } catch (error) {
        console.error('Failed to delete ingredient:', error);
      }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Add New Ingredient</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <Input
                  label="Ingredient Name"
                  value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                  placeholder="Enter ingredient name"
                  fullWidth
                />
                
                <div className="flex items-center">
                  <input
                    id="isPublic"
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                    Make this ingredient public (visible to all users)
                  </label>
                </div>
                
                <Button
                  variant="primary"
                  onClick={handleCreateIngredient}
                  isLoading={loading}
                  disabled={!newIngredientName.trim()}
                >
                  Add Ingredient
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Ingredient Stats</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <p className="text-gray-700">
                  Total Ingredients: <span className="font-bold">{ingredients.length}</span>
                </p>
                <p className="text-gray-700">
                  Public Ingredients: <span className="font-bold">{ingredients.filter(ing => ing.isPublic).length}</span>
                </p>
                <p className="text-gray-700">
                  Private Ingredients: <span className="font-bold">{ingredients.filter(ing => !ing.isPublic).length}</span>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex font-medium text-gray-700 bg-gray-100 px-4 py-3">
          <div className="w-1/2">Ingredient Name</div>
          <div className="w-1/4 text-center">Status</div>
          <div className="w-1/4 text-right">Actions</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredIngredients.length > 0 ? (
            filteredIngredients.map((ingredient) => (
              <div key={ingredient.id} className="flex items-center px-4 py-3">
                <div className="w-1/2 font-medium">{ingredient.name}</div>
                <div className="w-1/4 text-center">
                  {ingredient.isPublic ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Public
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Private
                    </span>
                  )}
                </div>
                <div className="w-1/4 text-right">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteIngredient(ingredient)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              No ingredients found. Create your first ingredient above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientsPage;

// src/pages/ProfilePage.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardHeader, CardBody } from '../components/ui/Card';

const ProfilePage: React.FC = () => {
  const { authState, updateUser, uploadProfileImage } = useAuth();
  const { user } = authState;
  
  const [isUploading, setIsUploading] = useState(false);
  
  const { values, handleChange, handleSubmit, isSubmitting, setValues } = useForm({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
    onSubmit: async (values) => {
      try {
        await updateUser(values);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Failed to update profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    },
  });
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      await uploadProfileImage(file);
      alert('Profile image updated successfully!');
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700">Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Profile Picture</h2>
              </CardHeader>
              <CardBody className="flex flex-col items-center">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="mt-4 text-center">
                  <label className="block">
                    <Button
                      variant="secondary"
                      isLoading={isUploading}
                      onClick={() => document.getElementById('profileImage')?.click()}
                    >
                      Change Image
                    </Button>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </CardBody>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Account Information</h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    fullWidth
                  />
                  
                  <Input
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    fullWidth
                  />
                  
                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Account Statistics</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <div className="text-3xl font-bold text-primary mb-1">-</div>
                <div className="text-gray-600">Total Meals</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <div className="text-3xl font-bold text-primary mb-1">-</div>
                <div className="text-gray-600">Total Recipes</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <div className="text-3xl font-bold text-primary mb-1">-</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

// src/pages/SettingsPage.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardBody } from '../components/ui/Card';

const SettingsPage: React.FC = () => {
  const { logout } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Application Settings</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Dark Mode</h3>
                    <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-gray-200"
                      role="switch"
                      aria-checked="false"
                    >
                      <span className="sr-only">Toggle dark mode</span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-0"
                      ></span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive emails about recipe suggestions</p>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-primary"
                      role="switch"
                      aria-checked="true"
                    >
                      <span className="sr-only">Enable notifications</span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-5"
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Sign Out</h3>
                    <p className="text-sm text-gray-500">Sign out from all devices</p>
                  </div>
                  <div>
                    <Button variant="danger" onClick={logout}>
                      Sign Out
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Delete Account</h3>
                    <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                  </div>
                  <div>
                    <Button variant="danger">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
