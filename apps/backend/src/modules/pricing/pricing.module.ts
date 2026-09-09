import { Module } from '@nestjs/common';
import { PRICE_PROVIDER } from './price-provider.interface';
import { CrowdsourcedPriceProvider } from './crowdsourced-price.provider';
import { PricingService } from './pricing.service';

@Module({
  providers: [
    CrowdsourcedPriceProvider,
    { provide: PRICE_PROVIDER, useExisting: CrowdsourcedPriceProvider },
    PricingService,
  ],
  exports: [PricingService],
})
export class PricingModule {}
