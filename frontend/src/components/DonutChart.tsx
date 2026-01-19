import { useMemo } from 'react';

interface DonutChartProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  trackColor?: string;
  ariaLabel?: string;
}

export function DonutChart({
  percent,
  size = 120,
  strokeWidth = 10,
  className = '',
  color,
  trackColor,
  ariaLabel,
}: DonutChartProps) {
  const { circumference, offset, radius, center } = useMemo(() => {
    const r = (size - strokeWidth) / 2;
    const c = size / 2;
    const circ = 2 * Math.PI * r;
    const off = circ - (percent / 100) * circ;

    return {
      radius: r,
      center: c,
      circumference: circ,
      offset: off,
    };
  }, [size, strokeWidth, percent]);

  // Clamp percent for display
  const displayPercent = Math.max(0, Math.min(100, percent));

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={ariaLabel || `Progress: ${displayPercent.toFixed(1)}%`}
    >
      {/* Background track */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={trackColor || 'currentColor'}
        strokeWidth={strokeWidth}
        className={trackColor ? '' : 'text-gray-200 dark:text-gray-700'}
      />

      {/* Progress arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color || 'currentColor'}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={`donut-progress ${color ? '' : 'text-primary-500'}`}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </svg>
  );
}

// Preset color variants based on progress
export function getProgressColor(percent: number): string {
  if (percent >= 90) return '#ef4444'; // red-500
  if (percent >= 75) return '#f97316'; // orange-500
  if (percent >= 50) return '#eab308'; // yellow-500
  if (percent >= 25) return '#22c55e'; // green-500
  return '#0ea5e9'; // primary-500
}

// Color variants for different timer types
export const TIMER_COLORS: Record<string, string> = {
  day: '#0ea5e9',      // sky-500
  week: '#8b5cf6',     // violet-500
  month: '#ec4899',    // pink-500
  year: '#f59e0b',     // amber-500
  custom: '#10b981',   // emerald-500
  life: '#6366f1',     // indigo-500
};
