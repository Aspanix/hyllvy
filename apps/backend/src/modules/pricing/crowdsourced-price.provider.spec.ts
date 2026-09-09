import { CrowdsourcedPriceProvider } from './crowdsourced-price.provider';

describe('CrowdsourcedPriceProvider (PriceProvider contract)', () => {
  it('returns null for a product/store pair with no observations yet', async () => {
    const provider = new CrowdsourcedPriceProvider();

    await expect(provider.getPrice('store-1', 'product-1')).resolves.toBeNull();
  });

  it('returns the most recently submitted observation for a store/product pair', async () => {
    const provider = new CrowdsourcedPriceProvider();

    await provider.submitObservation({
      storeId: 'store-1',
      productId: 'product-1',
      price: 29.9,
      currency: 'SEK',
      observedByUserId: 'user-1',
      confidence: null,
    });
    await provider.submitObservation({
      storeId: 'store-1',
      productId: 'product-1',
      price: 27.5,
      currency: 'SEK',
      observedByUserId: 'user-2',
      confidence: null,
    });

    const latest = await provider.getPrice('store-1', 'product-1');
    expect(latest?.price).toBe(27.5);
    expect(latest?.observedAt).toBeInstanceOf(Date);
  });

  it('keeps observations for different stores separate', async () => {
    const provider = new CrowdsourcedPriceProvider();

    await provider.submitObservation({
      storeId: 'store-1',
      productId: 'product-1',
      price: 29.9,
      currency: 'SEK',
      observedByUserId: 'user-1',
      confidence: null,
    });

    await expect(provider.getPrice('store-2', 'product-1')).resolves.toBeNull();
  });
});
