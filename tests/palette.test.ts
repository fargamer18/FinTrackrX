import { describe, it, expect } from 'vitest';
import { getChartTokens } from '@/components/charts/palette';

describe('getChartTokens', () => {
  it('returns dark categorical palette by default in dark mode', () => {
    const tokens = getChartTokens(true);
    expect(tokens.categorical.length).toBeGreaterThan(5);
    expect(tokens.axisTick).toMatch(/#/);
  });

  it('applies overrides when provided', () => {
    const overrideColors = ['#111111', '#222222'];
    const tokens = getChartTokens(false, { categorical: overrideColors, income: '#00ff00', expense: '#ff0000' });
    expect(tokens.categorical).toEqual(overrideColors);
    expect(tokens.income).toBe('#00ff00');
    expect(tokens.expense).toBe('#ff0000');
  });
});
