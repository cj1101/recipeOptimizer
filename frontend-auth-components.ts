// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { values, handleChange, handleSubmit, isSubmitting } = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        navigate('/meals'); // Redirect to dashboard after login
      } catch (err) {
        setError('Invalid email or password. Please try again.');
      }
    },
  });

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-600">Login to your Recipe Optimizer account</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          name="email"
          id="email"
          value={values.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
          fullWidth
        />

        <Input
          label="Password"
          type="password"
          name="password"
          id="password"
          value={values.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          fullWidth
        />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <input
              id="remember"
              aria-describedby="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
            />
            <label
              htmlFor="remember"
              className="ml-2 text-sm font-medium text-gray-600"
            >
              Remember me
            </label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
        >
          Sign in to your account
        </Button>

        <p className="text-sm font-light text-gray-500 mt-4">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;

// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validate = (values: RegisterFormValues) => {
    const errors: Partial<RegisterFormValues> = {};

    if (!values.username) {
      errors.username = 'Username is required';
    } else if (values.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const { values, errors, handleChange, handleSubmit, isSubmitting } =
    useForm<RegisterFormValues>({
      initialValues: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      validate,
      onSubmit: async (values) => {
        try {
          await register(values.username, values.email, values.password);
          navigate('/meals'); // Redirect to dashboard after registration
        } catch (err) {
          setError('Registration failed. The email or username may already be in use.');
        }
      },
    });

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
        <p className="text-gray-600">Join Recipe Optimizer today</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          type="text"
          name="username"
          id="username"
          value={values.username}
          onChange={handleChange}
          placeholder="johndoe"
          required
          fullWidth
          error={errors.username}
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          id="email"
          value={values.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
          fullWidth
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          id="password"
          value={values.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          fullWidth
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          required
          fullWidth
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
          className="mt-2"
        >
          Create account
        </Button>

        <p className="text-sm font-light text-gray-500 mt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;

// src/components/auth/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { values, handleChange, handleSubmit, isSubmitting } =
    useForm<ForgotPasswordFormValues>({
      initialValues: {
        email: '',
      },
      onSubmit: async (values) => {
        try {
          // In a real app, this would call an API endpoint
          // For this demo, we'll just simulate a successful request
          await new Promise(resolve => setTimeout(resolve, 1000));
          setIsSubmitted(true);
        } catch (err) {
          setError('Something went wrong. Please try again.');
        }
      },
    });

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Check your email</h2>
          <p className="text-gray-600 mt-1">
            We've sent a password reset link to your email address.
          </p>
        </div>
        <div className="mt-6">
          <Link to="/login">
            <Button variant="primary" fullWidth>
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
        <p className="text-gray-600">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          name="email"
          id="email"
          value={values.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
          fullWidth
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
          className="mt-2"
        >
          Send Reset Link
        </Button>

        <p className="text-sm font-light text-gray-500 mt-4">
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;

// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/login',
}) => {
  const { authState } = useAuth();
  const { isAuthenticated, loading } = authState;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
