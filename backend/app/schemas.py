from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class FoodEntryCreate(BaseModel):
    food_text: str
    meal_type: str = "snack"
    logged_at: Optional[datetime] = None

class FoodEntryResponse(BaseModel):
    id: UUID
    user_id: UUID
    food_text: str
    meal_type: str
    logged_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True
