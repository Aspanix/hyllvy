export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string | null;
  /** Open Food Facts product reference, when sourced from OFF. */
  offId: string | null;
}

export type NutritionSource = 'open_food_facts' | 'user_submitted';

/**
 * Drives the data-trust badge (build brief Section 12): 'verified' for an
 * authoritative source, 'community' for crowdsourced/unverified data,
 * 'missing' when no entry exists yet and the UI should prompt the user to
 * submit a label photo.
 */
export type TrustStatus = 'verified' | 'community' | 'missing';

export interface NutritionFact {
  productId: string;
  proteinG: number;
  carbsG: number;
  fatG: number;
  calories: number;
  /** Quantity the macro values above are per, e.g. 100 for "per 100g". */
  perQuantity: number;
  unit: string;
  source: NutritionSource;
  trustStatus: TrustStatus;
  submittedByUserId: string | null;
}
