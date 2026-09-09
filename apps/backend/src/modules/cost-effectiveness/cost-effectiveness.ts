import { NutritionFact } from '@hyllvy/shared-types';

export interface CostEffectivenessResult {
  /** Price per gram of protein - the MVP's headline score. Null when protein is 0. */
  pricePerGramProtein: number | null;
  pricePerCalorie: number | null;
}

/**
 * Pure, stateless calculation combining nutrition + price (build brief
 * Section 4). Deliberately framework-free so it stays trivial to unit test
 * and is a good first candidate to extract into its own package.
 *
 * `price` and `nutrition` must be on the same quantity basis (e.g. both for
 * the physical unit the user is buying, or both normalized per 100g) -
 * `nutrition.perQuantity`/`unit` are metadata about that basis, not an
 * input this calculation converts between. Normalizing mismatched bases is
 * the caller's responsibility.
 */
export function calculateCostEffectiveness(
  nutrition: NutritionFact,
  price: number,
): CostEffectivenessResult {
  return {
    pricePerGramProtein: nutrition.proteinG > 0 ? price / nutrition.proteinG : null,
    pricePerCalorie: nutrition.calories > 0 ? price / nutrition.calories : null,
  };
}
