import { Injectable } from '@nestjs/common';
import { PriceObservation } from '@hyllvy/shared-types';
import { PriceProvider } from './price-provider.interface';

/**
 * MVP's only PriceProvider: store-level prices confirmed/entered by users
 * at the point of scanning (build brief Section 2). No official retailer
 * API and no scraping - see LEGAL.md for why.
 *
 * TODO(deliverable - data layer): back this with the Postgres
 * ProductObservation table (Section 6) instead of an in-memory map once
 * the persistence layer is wired up.
 */
@Injectable()
export class CrowdsourcedPriceProvider implements PriceProvider {
  private readonly observations = new Map<string, PriceObservation>();

  async getPrice(storeId: string, productId: string): Promise<PriceObservation | null> {
    return this.observations.get(this.key(storeId, productId)) ?? null;
  }

  async submitObservation(
    observation: Omit<PriceObservation, 'observedAt'>,
  ): Promise<PriceObservation> {
    const record: PriceObservation = { ...observation, observedAt: new Date() };
    this.observations.set(this.key(observation.storeId, observation.productId), record);
    return record;
  }

  private key(storeId: string, productId: string): string {
    return `${storeId}:${productId}`;
  }
}
