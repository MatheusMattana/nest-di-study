import { Module } from '@nestjs/common';
import { PowerModule } from '../power/power.module';
import { MemoryService } from './memory.service';

@Module({
  imports: [PowerModule],
  providers: [MemoryService],
  exports: [MemoryService],
})
export class MemoryModule {}
