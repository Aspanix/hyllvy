import { Injectable } from '@nestjs/common';
import { NutritionFact } from '@hyllvy/shared-types';
import { calculateCostEffectiveness, CostEffectivenessResult } from './cost-effectiveness';

@Injectable()
export class CostEffectivenessService {
  calculate(nutrition: NutritionFact, price: number): CostEffectivenessResult {
    return calculateCostEffectiveness(nutrition, price);
  }
}
