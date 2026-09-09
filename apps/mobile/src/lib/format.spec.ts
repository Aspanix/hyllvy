import { formatCostPerGramProtein, formatPriceSek } from './format';

describe('formatPriceSek', () => {
  it('formats with a comma decimal and kr suffix', () => {
    expect(formatPriceSek(24.9)).toBe('24,90 kr');
  });

  it('rounds to two decimal places', () => {
    expect(formatPriceSek(89)).toBe('89,00 kr');
  });
});

describe('formatCostPerGramProtein', () => {
  it('formats with a period decimal and kr/g suffix', () => {
    expect(formatCostPerGramProtein(0.42)).toBe('0.42 kr/g');
  });
});
