import { useState, useEffect, useCallback } from 'react';
import { format, isToday, differenceInCalendarDays, startOfDay, parseISO } from 'date-fns';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodEntry {
  id: string;
  food_text: string;
  meal_type: MealType;
  logged_at: string;
  created_at: string;
}

const STORAGE_KEY = 'heynom_entries';

function loadEntries(): FoodEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: FoodEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useFood() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEntries(loadEntries());
    setLoading(false);
  }, []);

  const addEntry = useCallback((foodText: string, mealType: MealType, loggedAt?: Date) => {
    const entry: FoodEntry = {
      id: crypto.randomUUID(),
      food_text: foodText,
      meal_type: mealType,
      logged_at: (loggedAt || new Date()).toISOString(),
      created_at: new Date().toISOString(),
    };
    setEntries(prev => {
      const next = [entry, ...prev];
      saveEntries(next);
      return next;
    });
    return entry;
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => {
      const next = prev.filter(e => e.id !== id);
      saveEntries(next);
      return next;
    });
  }, []);

  const getEntriesForDate = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries.filter(e => format(parseISO(e.logged_at), 'yyyy-MM-dd') === dateStr);
  }, [entries]);

  const todayCount = entries.filter(e => isToday(parseISO(e.logged_at))).length;

  // Calculate streak
  const streak = (() => {
    if (entries.length === 0) return 0;
    const uniqueDays = new Set(entries.map(e => format(parseISO(e.logged_at), 'yyyy-MM-dd')));
    const sortedDays = Array.from(uniqueDays).sort().reverse();
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
    
    if (!sortedDays.includes(today) && !sortedDays.includes(yesterday)) return 0;
    
    let count = 0;
    let checkDate = startOfDay(new Date());
    if (!sortedDays.includes(format(checkDate, 'yyyy-MM-dd'))) {
      checkDate = new Date(checkDate.getTime() - 86400000);
    }
    
    for (let i = 0; i < 365; i++) {
      const dayStr = format(checkDate, 'yyyy-MM-dd');
      if (uniqueDays.has(dayStr)) {
        count++;
        checkDate = new Date(checkDate.getTime() - 86400000);
      } else {
        break;
      }
    }
    return count;
  })();

  // Group entries by date
  const groupedEntries = entries.reduce<Record<string, FoodEntry[]>>((acc, entry) => {
    const dateKey = format(parseISO(entry.logged_at), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {});

  // Sort within each group by time descending
  Object.values(groupedEntries).forEach(group => {
    group.sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime());
  });

  const sortedDates = Object.keys(groupedEntries).sort().reverse();

  return {
    entries,
    loading,
    addEntry,
    deleteEntry,
    getEntriesForDate,
    todayCount,
    streak,
    groupedEntries,
    sortedDates,
  };
}
