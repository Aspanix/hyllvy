import { TrustStatus } from '@hyllvy/shared-types';

/**
 * Placeholder data for the UI skeleton (build brief deliverable 3). The
 * client has no backend wiring yet - no GraphQL/BFF layer exists (that's
 * later work on top of the deliverable 2 domain modules) - so screens read
 * from this fixture instead of a network call.
 */
export interface MockScannedProduct {
  barcode: string;
  name: string;
  macroLine: string;
  price: number;
  pricePerGramProtein: number;
  trustStatus: TrustStatus;
}

export const mockStore = {
  name: 'Willys Sannegården',
};

export const mockMacroProgress = {
  protein: { current: 68, target: 200, unit: 'g' },
  calories: { current: 1240, target: 2400, unit: '' },
};

export const mockScannedProducts: MockScannedProduct[] = [
  {
    barcode: '7300156409827',
    name: 'Kvarg 500g',
    macroLine: '12g protein / 100g',
    price: 24.9,
    pricePerGramProtein: 0.42,
    trustStatus: 'verified',
  },
  {
    barcode: '7311070006012',
    name: 'Kycklingfile 1kg',
    macroLine: '23g protein / 100g',
    price: 89.0,
    pricePerGramProtein: 0.39,
    trustStatus: 'community',
  },
];

export function findMockProductByBarcode(barcode: string): MockScannedProduct | null {
  return mockScannedProducts.find((product) => product.barcode === barcode) ?? null;
}
