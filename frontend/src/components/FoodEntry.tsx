import { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import type { MealType } from '../hooks/useFood';

const mealTypes: { value: MealType; label: string; emoji: string }[] = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🍿' },
];

function guessDefaultMeal(): MealType {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 15) return 'lunch';
  if (hour >= 17 && hour < 22) return 'dinner';
  return 'snack';
}

interface FoodEntryProps {
  onAdd: (text: string, mealType: MealType, loggedAt?: Date) => void;
}

export default function FoodEntry({ onAdd }: FoodEntryProps) {
  const [text, setText] = useState('');
  const [mealType, setMealType] = useState<MealType>(guessDefaultMeal);
  const [showTime, setShowTime] = useState(false);
  const [customTime, setCustomTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    let loggedAt: Date | undefined;
    if (showTime && customTime) {
      const [hours, minutes] = customTime.split(':').map(Number);
      loggedAt = new Date();
      loggedAt.setHours(hours, minutes, 0, 0);
    }

    onAdd(text.trim(), mealType, loggedAt);
    setText('');
    setShowTime(false);
    setCustomTime('');
    setMealType(guessDefaultMeal());
  };

  return (
    <form className="food-entry-form" onSubmit={handleSubmit}>
      <div className="food-entry-form__input-row">
        <input
          type="text"
          className="food-entry-form__input"
          placeholder="What did you eat?"
          value={text}
          onChange={e => setText(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="food-entry-form__submit" disabled={!text.trim()}>
          <Plus size={20} />
        </button>
      </div>

      <div className="food-entry-form__options">
        <div className="food-entry-form__meals">
          {mealTypes.map(mt => (
            <button
              key={mt.value}
              type="button"
              className={`food-entry-form__meal-btn ${mealType === mt.value ? 'active' : ''}`}
              onClick={() => setMealType(mt.value)}
            >
              <span>{mt.emoji}</span>
              <span>{mt.label}</span>
            </button>
          ))}
        </div>

        <div className="food-entry-form__time-row">
          <button
            type="button"
            className={`food-entry-form__time-toggle ${showTime ? 'active' : ''}`}
            onClick={() => setShowTime(!showTime)}
          >
            <Clock size={14} />
            <span>{showTime ? 'Custom time' : 'Now'}</span>
          </button>
          {showTime && (
            <input
              type="time"
              className="food-entry-form__time-input"
              value={customTime}
              onChange={e => setCustomTime(e.target.value)}
            />
          )}
        </div>
      </div>
    </form>
  );
}
