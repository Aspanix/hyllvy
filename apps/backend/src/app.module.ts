import { Module } from '@nestjs/common';
import { ProductNutritionModule } from './modules/product-nutrition/product-nutrition.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { UserMacroModule } from './modules/user-macro/user-macro.module';
import { CostEffectivenessModule } from './modules/cost-effectiveness/cost-effectiveness.module';

@Module({
  imports: [ProductNutritionModule, PricingModule, UserMacroModule, CostEffectivenessModule],
})
export class AppModule {}
