import { Inject, Injectable } from '@nestjs/common';
import { PriceObservation } from '@hyllvy/shared-types';
import { PRICE_PROVIDER, PriceProvider } from './price-provider.interface';

/**
 * Depends on the PriceProvider interface, not a concrete provider, so the
 * crowdsourced source can be swapped/augmented later without touching
 * callers (build brief Section 8 - depend on interfaces).
 */
@Injectable()
export class PricingService {
  constructor(@Inject(PRICE_PROVIDER) private readonly priceProvider: PriceProvider) {}

  getPrice(storeId: string, productId: string): Promise<PriceObservation | null> {
    return this.priceProvider.getPrice(storeId, productId);
  }

  submitObservation(
    observation: Omit<PriceObservation, 'observedAt'>,
  ): Promise<PriceObservation> {
    return this.priceProvider.submitObservation(observation);
  }
}
