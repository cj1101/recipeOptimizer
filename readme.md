# Recipe Optimizer Web Application

A web application for tracking, rating, and optimizing recipes using machine learning. The app allows users to create meals, add recipes with custom ingredients, rate them, and get AI-powered suggestions for improvements.

## Features

- **User Authentication**: Register, login, forgot password functionalities
- **Meal Management**: Create, view, update, and delete meals
- **Recipe Management**: Add recipes to meals with custom ingredients and ratings
- **Ingredient Management**: Maintain a personal ingredient database
- **AI Recipe Optimization**: ML model analyzes recipe ratings to suggest improved versions
- **Rating System**: Rate recipes from 1-10 to help the ML model learn preferences
- **Recipe Scaling**: Scale recipes up or down for different serving sizes
- **Ingredient Analysis**: Visualize which ingredients have the most influence on ratings
- **Recipe Sharing**: Share recipes with other users

## Tech Stack

### Frontend
- React
- TypeScript
- React Router for navigation
- Context API for state management
- TailwindCSS for styling with custom grunge theme
- Recharts for data visualization

### Backend
- Python with FastAPI
- PostgreSQL database
- SQLAlchemy ORM
- scikit-learn for machine learning
- JWT authentication

## Getting Started

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- PostgreSQL

### Installation

#### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/recipe-optimizer.git
   cd recipe-optimizer/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and settings
   ```

5. Initialize the database:
   ```bash
   alembic upgrade head
   ```

6. Run the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API URL and other settings
   ```

4. Run the development server:
   ```bash
   npm start
   ```

## Project Structure

### Frontend
```
recipe-optimizer-frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application pages
│   ├── services/        # API services
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   ├── index.tsx        # Entry point
│   └── routes.tsx       # Application routes
```

### Backend
```
recipe-optimizer-backend/
├── app/
│   ├── api/             # API endpoints
│   ├── core/            # Core application code
│   ├── db/              # Database setup
│   ├── models/          # Database models
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic services
│   ├── ml/              # Machine learning components
│   ├── utils/           # Utility functions
│   └── main.py          # FastAPI application
├── alembic/             # Database migrations
├── tests/               # Test suite
└── requirements.txt     # Python dependencies
```

## Machine Learning Implementation

The recipe optimization uses a combination of linear regression and more advanced models:

1. **Data Collection**: The system records recipe ingredients and user ratings
2. **Feature Engineering**: Ingredients are converted to feature vectors
3. **Model Training**: Multiple models (Linear Regression, Random Forest, etc.) are trained
4. **Cross-Validation**: The best model is selected through cross-validation
5. **Prediction**: The model predicts ratings for modified recipes
6. **Optimization**: Ingredient quantities are iteratively adjusted to maximize predicted ratings

## Deployment

### Backend
- Deploy using Docker to Heroku, AWS, or other cloud providers
- Set up a PostgreSQL database instance
- Configure environment variables for production

### Frontend
- Build the React app: `npm run build`
- Deploy the built files to Vercel, Netlify, or another static hosting service

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspiration from iOS recipe apps
- ML algorithms based on various recommendation systems
- UI design inspired by modern cooking applications
