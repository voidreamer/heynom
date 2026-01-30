import { Flame, UtensilsCrossed } from 'lucide-react';

interface StatsProps {
  todayCount: number;
  streak: number;
}

export default function Stats({ todayCount, streak }: StatsProps) {
  return (
    <div className="stats-row">
      <div className="stat-card stat-card--meals">
        <div className="stat-card__icon">
          <UtensilsCrossed size={20} />
        </div>
        <div className="stat-card__info">
          <div className="stat-card__value">{todayCount}</div>
          <div className="stat-card__label">Today</div>
        </div>
      </div>
      <div className="stat-card stat-card--streak">
        <div className="stat-card__icon">
          <Flame size={20} />
        </div>
        <div className="stat-card__info">
          <div className="stat-card__value">{streak}</div>
          <div className="stat-card__label">Day streak</div>
        </div>
      </div>
    </div>
  );
}
