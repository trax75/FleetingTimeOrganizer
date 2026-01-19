import type { Timer, TimerProgress, PercentDecimals } from '../types';
import { DonutChart, TIMER_COLORS } from './DonutChart';
import { formatDuration, formatPercent } from '../utils/timeCalculations';

interface TimerCardProps {
  timer: Timer;
  progress: TimerProgress;
  percentDecimals?: PercentDecimals;
  onEdit?: (timer: Timer) => void;
  onDelete?: (id: string) => void;
}

export function TimerCard({ timer, progress, percentDecimals = 1, onEdit, onDelete }: TimerCardProps) {
  const color = TIMER_COLORS[timer.type] || TIMER_COLORS['custom'];

  const displayPercent = timer.mode === 'remaining'
    ? progress.percent
    : progress.percent;

  const timeDisplay = timer.mode === 'remaining'
    ? formatDuration(progress.remainingMs)
    : formatDuration(progress.elapsedMs);

  const modeLabel = timer.mode === 'remaining' ? 'remaining' : 'elapsed';

  const statusText = progress.status === 'not-started'
    ? 'Not started'
    : progress.status === 'ended'
    ? 'Ended'
    : null;

  return (
    <div className="card flex flex-col items-center gap-4 relative group">
      {/* Action buttons */}
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && timer.type === 'custom' && (
            <button
              onClick={() => onEdit(timer)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              aria-label={`Edit ${timer.name}`}
            >
              <EditIcon />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(timer.id)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              aria-label={`Delete ${timer.name}`}
            >
              <TrashIcon />
            </button>
          )}
        </div>
      )}

      {/* Title */}
      <div className="text-center">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          {timer.name}
        </h3>
        <span
          className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full uppercase tracking-wide"
          style={{
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {modeLabel}
        </span>
      </div>

      {/* Donut chart */}
      <div className="relative">
        <DonutChart
          percent={displayPercent}
          size={120}
          strokeWidth={10}
          color={color}
          ariaLabel={`${timer.name} ${modeLabel}: ${formatPercent(displayPercent, percentDecimals)}`}
        />

        {/* Center percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatPercent(displayPercent, percentDecimals)}
          </span>
        </div>
      </div>

      {/* Time details */}
      <div className="text-center">
        {statusText ? (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {statusText}
          </span>
        ) : (
          <span className="text-sm text-gray-600 dark:text-gray-300 font-mono">
            {timeDisplay} {modeLabel}
          </span>
        )}
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}
