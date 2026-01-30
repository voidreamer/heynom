import { format, parseISO } from 'date-fns';
import { Trash2 } from 'lucide-react';
import type { FoodEntry, MealType } from '../hooks/useFood';

const mealEmoji: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍿',
};

const mealLabel: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

interface FoodCardProps {
  entry: FoodEntry;
  onDelete: (id: string) => void;
}

export default function FoodCard({ entry, onDelete }: FoodCardProps) {
  const time = format(parseISO(entry.logged_at), 'h:mm a');

  return (
    <div className={`food-card food-card--${entry.meal_type}`}>
      <div className="food-card__left">
        <div className={`food-card__icon food-card__icon--${entry.meal_type}`}>
          {mealEmoji[entry.meal_type]}
        </div>
        <div className="food-card__content">
          <div className="food-card__text">{entry.food_text}</div>
          <div className="food-card__meta">
            <span className={`food-card__meal-badge food-card__meal-badge--${entry.meal_type}`}>
              {mealLabel[entry.meal_type]}
            </span>
            <span className="food-card__time">{time}</span>
          </div>
        </div>
      </div>
      <button className="food-card__delete" onClick={() => onDelete(entry.id)} aria-label="Delete entry">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
