from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from ..schemas import FoodEntryCreate, FoodEntryResponse

router = APIRouter(prefix="/food", tags=["food"])

@router.get("/", response_model=List[FoodEntryResponse])
async def list_food_entries(limit: int = 100):
    # TODO: implement with database
    return []

@router.post("/", response_model=FoodEntryResponse, status_code=201)
async def create_food_entry(entry: FoodEntryCreate):
    # TODO: implement with database
    raise HTTPException(status_code=501, detail="Not implemented")

@router.delete("/{entry_id}", status_code=204)
async def delete_food_entry(entry_id: UUID):
    # TODO: implement with database
    raise HTTPException(status_code=501, detail="Not implemented")
