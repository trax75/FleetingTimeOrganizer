import type { LifeTimerProgress, PercentDecimals } from '../types';
import { DonutChart, TIMER_COLORS } from './DonutChart';
import { formatPercent } from '../utils/timeCalculations';

interface LifeTimerCardProps {
  progress: LifeTimerProgress;
  mode: 'elapsed' | 'remaining';
  percentDecimals?: PercentDecimals;
  onEdit?: () => void;
}

export function LifeTimerCard({ progress, mode, percentDecimals = 1, onEdit }: LifeTimerCardProps) {
  const color = TIMER_COLORS['life'];

  const displayPercent = mode === 'remaining'
    ? 100 - progress.percent
    : progress.percent;

  const yearsDisplay = mode === 'remaining'
    ? progress.yearsRemaining.toFixed(1)
    : progress.yearsLived.toFixed(1);

  const modeLabel = mode === 'remaining' ? 'remaining' : 'elapsed';

  return (
    <div className="card flex flex-col items-center gap-4 relative group col-span-full sm:col-span-2 lg:col-span-1">
      {/* Edit button */}
      {onEdit && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            aria-label="Edit Life Timer"
          >
            <EditIcon />
          </button>
        </div>
      )}

      {/* Title */}
      <div className="text-center">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          Life
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
          ariaLabel={`Life ${modeLabel}: ${formatPercent(displayPercent, percentDecimals)}`}
        />

        {/* Center percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatPercent(displayPercent, percentDecimals)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="text-center space-y-1">
        <div className="text-sm text-gray-600 dark:text-gray-300 font-mono">
          ~{yearsDisplay} years {modeLabel}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Est. lifespan: {progress.estimatedLifespan.toFixed(0)} years
          <span className="text-gray-400 dark:text-gray-500">
            {' '}({progress.rangeMin.toFixed(0)}–{progress.rangeMax.toFixed(0)})
          </span>
        </div>
      </div>

      {/* Disclaimer link */}
      <button
        onClick={onEdit}
        className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 underline"
      >
        View estimate details
      </button>
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
