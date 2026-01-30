import { format, parseISO, isToday, isYesterday } from 'date-fns';
import FoodCard from './FoodCard';
import type { FoodEntry } from '../hooks/useFood';

function formatDateHeader(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEEE, MMMM d');
}

interface TimelineProps {
  groupedEntries: Record<string, FoodEntry[]>;
  sortedDates: string[];
  onDelete: (id: string) => void;
}

export default function Timeline({ groupedEntries, sortedDates, onDelete }: TimelineProps) {
  if (sortedDates.length === 0) {
    return (
      <div className="timeline-empty">
        <div className="timeline-empty__icon">🍽️</div>
        <h3>No entries yet</h3>
        <p>Log your first meal above to get started!</p>
      </div>
    );
  }

  return (
    <div className="timeline">
      {sortedDates.map(dateStr => (
        <div key={dateStr} className="timeline__day">
          <div className="timeline__date-header">
            <span className="timeline__date-text">{formatDateHeader(dateStr)}</span>
            <span className="timeline__date-count">{groupedEntries[dateStr].length} entries</span>
          </div>
          <div className="timeline__entries">
            {groupedEntries[dateStr].map(entry => (
              <FoodCard key={entry.id} entry={entry} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
