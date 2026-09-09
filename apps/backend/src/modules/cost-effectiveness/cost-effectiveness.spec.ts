import { NutritionFact } from '@hyllvy/shared-types';
import { calculateCostEffectiveness } from './cost-effectiveness';

function nutrition(overrides: Partial<NutritionFact> = {}): NutritionFact {
  return {
    productId: 'p1',
    proteinG: 20,
    carbsG: 5,
    fatG: 2,
    calories: 120,
    perQuantity: 100,
    unit: 'g',
    source: 'open_food_facts',
    trustStatus: 'verified',
    submittedByUserId: null,
    ...overrides,
  };
}

describe('calculateCostEffectiveness', () => {
  it('computes price per gram of protein and per calorie', () => {
    const result = calculateCostEffectiveness(nutrition(), 30);

    expect(result.pricePerGramProtein).toBeCloseTo(30 / 20);
    expect(result.pricePerCalorie).toBeCloseTo(30 / 120);
  });

  it('returns null pricePerGramProtein when the product has no protein', () => {
    const result = calculateCostEffectiveness(nutrition({ proteinG: 0 }), 30);

    expect(result.pricePerGramProtein).toBeNull();
  });

  it('returns null pricePerCalorie when the product has no calories', () => {
    const result = calculateCostEffectiveness(nutrition({ calories: 0 }), 30);

    expect(result.pricePerCalorie).toBeNull();
  });

  it('ignores perQuantity/unit - price and nutrition must already share a basis', () => {
    // Caller's responsibility to normalize; this function only ever
    // divides price by the protein/calorie figures it's given.
    const result = calculateCostEffectiveness(
      nutrition({ proteinG: 10, perQuantity: 50 }),
      15,
    );

    expect(result.pricePerGramProtein).toBeCloseTo(15 / 10);
  });
});
