import { Module } from '@nestjs/common';
import { ProductNutritionService } from './product-nutrition.service';

@Module({
  providers: [ProductNutritionService],
  exports: [ProductNutritionService],
})
export class ProductNutritionModule {}
