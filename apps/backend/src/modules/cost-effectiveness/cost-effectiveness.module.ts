import { Module } from '@nestjs/common';
import { CostEffectivenessService } from './cost-effectiveness.service';

@Module({
  providers: [CostEffectivenessService],
  exports: [CostEffectivenessService],
})
export class CostEffectivenessModule {}
