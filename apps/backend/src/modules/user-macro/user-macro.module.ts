import { Module } from '@nestjs/common';
import { UserMacroService } from './user-macro.service';

@Module({
  providers: [UserMacroService],
  exports: [UserMacroService],
})
export class UserMacroModule {}
