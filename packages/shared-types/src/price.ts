export type StoreChain = 'willys' | 'ica' | 'lidl' | 'other';

export interface Store {
  id: string;
  chain: StoreChain;
  name: string;
  address: string;
  lat: number;
  lng: number;
  /** Cheap to carry from day one - avoids a painful migration when expanding beyond Sweden. */
  region: string;
}

export interface PriceObservation {
  storeId: string;
  productId: string;
  price: number;
  currency: string;
  observedByUserId: string;
  observedAt: Date;
  /** Reserved for future use (e.g. weighting repeated observations). */
  confidence: number | null;
}
