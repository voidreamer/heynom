import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FoodCard from './FoodCard';
import type { FoodEntry } from '../hooks/useFood';

interface CalendarViewProps {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
}

export default function CalendarView({ entries, onDelete }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const daysWithEntries = useMemo(() => {
    const set = new Set<string>();
    entries.forEach(e => set.add(format(parseISO(e.logged_at), 'yyyy-MM-dd')));
    return set;
  }, [entries]);

  const selectedEntries = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return entries
      .filter(e => format(parseISO(e.logged_at), 'yyyy-MM-dd') === dateStr)
      .sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime());
  }, [selectedDate, entries]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const weeks: Date[][] = [];
  let day = calStart;
  while (day <= calEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button className="calendar__nav" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft size={20} />
        </button>
        <h3 className="calendar__title">{format(currentMonth, 'MMMM yyyy')}</h3>
        <button className="calendar__nav" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="calendar__weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="calendar__weekday">{d}</div>
        ))}
      </div>

      <div className="calendar__grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="calendar__week">
            {week.map((d, di) => {
              const dateStr = format(d, 'yyyy-MM-dd');
              const inMonth = isSameMonth(d, currentMonth);
              const isSelected = selectedDate && isSameDay(d, selectedDate);
              const hasEntries = daysWithEntries.has(dateStr);

              return (
                <button
                  key={di}
                  className={`calendar__day ${!inMonth ? 'calendar__day--outside' : ''} ${isSelected ? 'calendar__day--selected' : ''} ${hasEntries ? 'calendar__day--has-entries' : ''}`}
                  onClick={() => setSelectedDate(d)}
                >
                  <span>{format(d, 'd')}</span>
                  {hasEntries && <div className="calendar__dot" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="calendar__selected-day">
          <h4 className="calendar__selected-title">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h4>
          {selectedEntries.length === 0 ? (
            <p className="calendar__no-entries">No entries for this day</p>
          ) : (
            <div className="calendar__entries">
              {selectedEntries.map(entry => (
                <FoodCard key={entry.id} entry={entry} onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
