import { PriceObservation } from '@hyllvy/shared-types';

/**
 * A source of store-level price data. MVP ships CrowdsourcedPriceProvider
 * only; the interface exists so a ScraperPriceProvider or official retailer
 * API provider could be added later as a peer implementation without
 * changing calling code (build brief Section 3/4 - retailer scraping is
 * explicitly out of scope for MVP for legal reasons, see LEGAL.md).
 */
export interface PriceProvider {
  getPrice(storeId: string, productId: string): Promise<PriceObservation | null>;
  submitObservation(
    observation: Omit<PriceObservation, 'observedAt'>,
  ): Promise<PriceObservation>;
}

export const PRICE_PROVIDER = Symbol('PRICE_PROVIDER');
