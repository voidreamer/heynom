import { useState, useEffect, useCallback } from 'react';
import { format, isToday, startOfDay, parseISO } from 'date-fns';
import { useAuth } from './useAuth';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodEntry {
  id: string;
  food_text: string;
  meal_type: MealType;
  logged_at: string;
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || '';

export function useFood() {
  const { session } = useAuth();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const headers = useCallback(() => {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (session?.access_token) {
      h['Authorization'] = `Bearer ${session.access_token}`;
    }
    return h;
  }, [session]);

  // Fetch entries from API
  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch(`${API_URL}/api/food/`, { headers: headers() })
      .then(r => r.ok ? r.json() : [])
      .then(data => setEntries(data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [session, headers]);

  const addEntry = useCallback(async (foodText: string, mealType: MealType, loggedAt?: Date) => {
    const body = {
      food_text: foodText,
      meal_type: mealType,
      logged_at: (loggedAt || new Date()).toISOString(),
    };
    try {
      const res = await fetch(`${API_URL}/api/food/`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const entry = await res.json();
        setEntries(prev => [entry, ...prev]);
        return entry;
      }
    } catch {
      // fallback silent
    }
  }, [headers]);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      await fetch(`${API_URL}/api/food/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch {
      // fallback silent
    }
  }, [headers]);

  const getEntriesForDate = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries.filter(e => format(parseISO(e.logged_at), 'yyyy-MM-dd') === dateStr);
  }, [entries]);

  const todayCount = entries.filter(e => isToday(parseISO(e.logged_at))).length;

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

  const groupedEntries = entries.reduce<Record<string, FoodEntry[]>>((acc, entry) => {
    const dateKey = format(parseISO(entry.logged_at), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {});

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
