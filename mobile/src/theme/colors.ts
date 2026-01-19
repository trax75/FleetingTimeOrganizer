export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Timer type colors
  timer: {
    day: '#0ea5e9',     // sky-500
    week: '#8b5cf6',    // violet-500
    month: '#ec4899',   // pink-500
    year: '#f59e0b',    // amber-500
    custom: '#10b981',  // emerald-500
    life: '#6366f1',    // indigo-500
  },

  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const lightTheme = {
  background: colors.gray[50],
  surface: '#ffffff',
  surfaceSecondary: colors.gray[100],
  text: colors.gray[900],
  textSecondary: colors.gray[600],
  textTertiary: colors.gray[400],
  border: colors.gray[200],
  primary: colors.primary[500],
  primaryText: '#ffffff',
};

export const darkTheme = {
  background: colors.gray[950],
  surface: colors.gray[900],
  surfaceSecondary: colors.gray[800],
  text: colors.gray[100],
  textSecondary: colors.gray[400],
  textTertiary: colors.gray[500],
  border: colors.gray[700],
  primary: colors.primary[500],
  primaryText: '#ffffff',
};

export type Theme = typeof lightTheme;
