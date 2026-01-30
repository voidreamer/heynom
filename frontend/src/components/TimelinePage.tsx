import { useState, useMemo } from 'react';
import { format, addDays, isToday } from 'date-fns';
import FoodCard from './FoodCard';
import type { FoodEntry, MealType } from '../hooks/useFood';

const mealOrder: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
const mealLabels: Record<MealType, string> = {
  breakfast: '🌅 Breakfast',
  lunch: '☀️ Lunch',
  dinner: '🌙 Dinner',
  snack: '🍿 Snack',
};

interface TimelinePageProps {
  getEntriesForDate: (date: Date) => FoodEntry[];
  onDelete: (id: string) => void;
}

export default function TimelinePage({ getEntriesForDate, onDelete }: TimelinePageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigateDay = (offset: number) => {
    setSelectedDate(prev => addDays(prev, offset));
  };

  const goToToday = () => setSelectedDate(new Date());

  const dayEntries = getEntriesForDate(selectedDate);

  const groupedByMeal = useMemo(() => {
    const groups: Partial<Record<MealType, FoodEntry[]>> = {};
    for (const entry of dayEntries) {
      if (!groups[entry.meal_type]) groups[entry.meal_type] = [];
      groups[entry.meal_type]!.push(entry);
    }
    // Sort each group by time
    for (const entries of Object.values(groups)) {
      entries!.sort((a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime());
    }
    return groups;
  }, [dayEntries]);

  const todayLabel = isToday(selectedDate);

  return (
    <div className="timeline-page">
      <div className="timeline-nav-header">
        <button className="timeline-nav-btn" onClick={() => navigateDay(-1)}>◀</button>
        <div className="timeline-nav-date" onClick={goToToday}>
          {todayLabel ? 'Today' : format(selectedDate, 'EEE, MMM d, yyyy')}
        </div>
        <button className="timeline-nav-btn" onClick={() => navigateDay(1)}>▶</button>
      </div>

      {dayEntries.length === 0 ? (
        <div className="timeline-empty">
          <div className="timeline-empty__icon">📭</div>
          <h3>No entries</h3>
          <p>{todayLabel ? 'Log your first meal from the Home tab!' : 'Nothing logged this day.'}</p>
        </div>
      ) : (
        <div className="timeline-day-entries">
          {mealOrder.map(meal => {
            const entries = groupedByMeal[meal];
            if (!entries || entries.length === 0) return null;
            return (
              <div key={meal} className="timeline-meal-section">
                <div className="timeline-meal-header">{mealLabels[meal]}</div>
                <div className="timeline__entries">
                  {entries.map(entry => (
                    <FoodCard key={entry.id} entry={entry} onDelete={onDelete} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
