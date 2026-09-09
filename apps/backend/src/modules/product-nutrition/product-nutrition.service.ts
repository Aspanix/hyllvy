import { Injectable } from '@nestjs/common';
import { NutritionFact, Product } from '@hyllvy/shared-types';

export interface ProductNutritionLookup {
  product: Product;
  nutrition: NutritionFact;
}

/**
 * Normalizes/caches Open Food Facts data by barcode (build brief Section 4).
 * The API path always reads from the local cache/DB - a scheduled BullMQ
 * job (Section 4 async backbone, added in a later deliverable) keeps that
 * cache warm so a flaky OFF API never causes a user-facing failure.
 *
 * TODO(deliverable - data layer + async jobs): implement the Postgres/Redis
 * backed cache and the OFF sync job. Stubbed for now.
 */
@Injectable()
export class ProductNutritionService {
  async lookupByBarcode(_barcode: string): Promise<ProductNutritionLookup | null> {
    throw new Error('ProductNutritionService.lookupByBarcode is not implemented yet');
  }
}
