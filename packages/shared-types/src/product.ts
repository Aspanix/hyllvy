export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string | null;
  /** Open Food Facts product reference, when sourced from OFF. */
  offId: string | null;
}

export interface NutritionFact {
  productId: string;
  proteinG: number;
  carbsG: number;
  fatG: number;
  calories: number;
  /** Quantity the macro values above are per, e.g. 100 for "per 100g". */
  perQuantity: number;
  unit: string;
}
