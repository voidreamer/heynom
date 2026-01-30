from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import datetime, timezone

from ..auth import get_current_user
from ..database import get_db
from ..models import FoodEntry
from ..schemas import FoodEntryCreate, FoodEntryResponse

router = APIRouter(prefix="/food", tags=["food"])


@router.get("/", response_model=List[FoodEntryResponse])
async def list_food_entries(
    limit: int = 200,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = user.get("sub")
    entries = (
        db.query(FoodEntry)
        .filter(FoodEntry.user_id == user_id)
        .order_by(FoodEntry.logged_at.desc())
        .limit(limit)
        .all()
    )
    return entries


@router.post("/", response_model=FoodEntryResponse, status_code=201)
async def create_food_entry(
    entry: FoodEntryCreate,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = user.get("sub")
    db_entry = FoodEntry(
        user_id=user_id,
        food_text=entry.food_text,
        meal_type=entry.meal_type,
        logged_at=entry.logged_at or datetime.now(timezone.utc),
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


@router.delete("/{entry_id}", status_code=204)
async def delete_food_entry(
    entry_id: UUID,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = user.get("sub")
    entry = (
        db.query(FoodEntry)
        .filter(FoodEntry.id == entry_id, FoodEntry.user_id == user_id)
        .first()
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
