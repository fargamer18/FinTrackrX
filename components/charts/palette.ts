// Shared vibrant RGB palettes and tokens for charts in light/dark mode
// Keep colors highly legible on dark backgrounds and pleasant on light.

export type ChartTokens = {
  axisTick: string;
  grid: string;
  legendText: string;
  income: string;
  expense: string;
  categorical: string[];
};

export function getChartTokens(isDark: boolean, overrides?: { categorical?: string[]; income?: string; expense?: string; }): ChartTokens {
  const categoricalDark = [
    'rgb(59, 130, 246)',  // blue-500
    'rgb(16, 185, 129)',  // emerald-500
    'rgb(250, 204, 21)',  // yellow-400
    'rgb(244, 63, 94)',   // rose-500
    'rgb(168, 85, 247)',  // purple-500
    'rgb(34, 197, 94)',   // green-500
    'rgb(2, 132, 199)',   // sky-600
    'rgb(236, 72, 153)',  // pink-500
    'rgb(234, 179, 8)',   // amber-500
    'rgb(14, 165, 233)',  // sky-500
  ];

  const categoricalLight = [
    'rgb(37, 99, 235)',   // blue-600
    'rgb(5, 150, 105)',   // emerald-600
    'rgb(217, 119, 6)',   // amber-600
    'rgb(220, 38, 38)',   // red-600
    'rgb(147, 51, 234)',  // purple-600
    'rgb(22, 163, 74)',   // green-600
    'rgb(2, 132, 199)',   // sky-600
    'rgb(219, 39, 119)',  // pink-600
    'rgb(245, 158, 11)',  // amber-500
    'rgb(59, 130, 246)',  // blue-500
  ];

  const base = {
    axisTick: isDark ? '#e5e7eb' /* gray-200/300 */ : '#374151' /* gray-700 */,
    grid: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
    legendText: isDark ? '#e5e7eb' : '#374151',
    income: isDark ? 'rgb(34, 197, 94)' : 'rgb(16, 185, 129)', // greens
    expense: isDark ? 'rgb(239, 68, 68)' : 'rgb(244, 63, 94)', // reds
    categorical: isDark ? categoricalDark : categoricalLight,
  } as ChartTokens;

  if (overrides) {
    return {
      ...base,
      income: overrides.income || base.income,
      expense: overrides.expense || base.expense,
      categorical: overrides.categorical && overrides.categorical.length ? overrides.categorical : base.categorical,
    } as ChartTokens;
  }

  return base;
}
