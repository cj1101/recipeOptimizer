# app/schemas/token.py
from typing import Optional
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None

# app/schemas/user.py
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    profile_image: Optional[str] = None

# Properties to receive on user creation
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

# Properties to receive on user update
class UserUpdate(UserBase):
    password: Optional[str] = None

# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Properties to return to client
class User(UserInDBBase):
    pass

# Properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str

# app/schemas/meal.py
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class MealBase(BaseModel):
    name: str

# Properties to receive on meal creation
class MealCreate(MealBase):
    pass

# Properties to receive on meal update
class MealUpdate(MealBase):
    pass

# Properties shared by models stored in DB
class MealInDBBase(MealBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Properties to return to client
class Meal(MealInDBBase):
    recipe_count: int
    average_rating: Optional[float] = None

# Properties stored in DB
class MealInDB(MealInDBBase):
    pass

# app/schemas/recipe.py
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum

class MeasurementUnit(str, Enum):
    # Weight
    GRAM = 'g'
    KILOGRAM = 'kg'
    OUNCE = 'oz'
    POUND = 'lb'
    
    # Volume
    MILLILITER = 'ml'
    LITER = 'L'
    TEASPOON = 'tsp'
    TABLESPOON = 'tbsp'
    FLUID_OUNCE = 'fl oz'
    CUP = 'cup'
    PINT = 'pint'
    QUART = 'quart'
    GALLON = 'gallon'
    
    # Count
    UNIT = 'unit(s)'
    PIECE = 'piece(s)'
    PINCH = 'pinch'

# Ingredient base
class RecipeIngredientBase(BaseModel):
    ingredient_id: int
    quantity: float
    unit: MeasurementUnit

# Recipe ingredient create
class RecipeIngredientCreate(RecipeIngredientBase):
    pass

# Recipe ingredient update
class RecipeIngredientUpdate(RecipeIngredientBase):
    pass

# Recipe ingredient in DB
class RecipeIngredientInDB(RecipeIngredientBase):
    id: int
    recipe_id: int
    
    class Config:
        orm_mode = True

# Recipe ingredient to return to client
class RecipeIngredient(RecipeIngredientInDB):
    ingredient_name: str

# Shared properties
class RecipeBase(BaseModel):
    notes: Optional[str] = None
    rating: float = Field(..., ge=1.0, le=10.0)

# Properties to receive on recipe creation
class RecipeCreate(RecipeBase):
    meal_id: int
    ingredients: List[RecipeIngredientCreate]

# Properties to receive on recipe update
class RecipeUpdate(RecipeBase):
    ingredients: Optional[List[RecipeIngredientUpdate]] = None

# Properties shared by models stored in DB
class RecipeInDBBase(RecipeBase):
    id: int
    meal_id: int
    is_ai_generated: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Properties to return to client
class Recipe(RecipeInDBBase):
    ingredients: List[RecipeIngredient]

# Properties stored in DB
class RecipeInDB(RecipeInDBBase):
    pass

# app/schemas/ingredient.py
from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class IngredientBase(BaseModel):
    name: str
    is_public: bool = False

# Properties to receive on ingredient creation
class IngredientCreate(IngredientBase):
    pass

# Properties to receive on ingredient update
class IngredientUpdate(IngredientBase):
    pass

# Properties shared by models stored in DB
class IngredientInDBBase(IngredientBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Properties to return to client
class Ingredient(IngredientInDBBase):
    pass

# Properties stored in DB
class IngredientInDB(IngredientInDBBase):
    pass

# app/schemas/ml.py
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from .recipe import MeasurementUnit, RecipeIngredient

class IngredientInfluence(BaseModel):
    ingredient_id: int
    ingredient_name: str
    unit: MeasurementUnit
    influence: float

class RecipeSuggestion(BaseModel):
    id: int
    meal_id: int
    ingredients: List[RecipeIngredient]
    predicted_rating: float = Field(..., ge=1.0, le=10.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    created_at: datetime
    
    class Config:
        orm_mode = True

# app/schemas/social.py
from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class SocialShareBase(BaseModel):
    recipe_id: int

class SocialShareCreate(SocialShareBase):
    pass

class SocialShareInDB(SocialShareBase):
    id: int
    share_token: str
    expiry_date: datetime
    created_at: datetime
    
    class Config:
        orm_mode = True

class SocialShare(SocialShareInDB):
    pass
