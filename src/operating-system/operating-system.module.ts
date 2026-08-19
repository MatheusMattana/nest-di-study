import { Module } from '@nestjs/common';
import { MotherboardModule } from '../motherboard/motherboard.module';
import { MemoryModule } from '../memory/memory.module';
import { OperatingSystemService } from './operating-system.service';

@Module({
  imports: [MotherboardModule, MemoryModule],
  providers: [OperatingSystemService],
  exports: [OperatingSystemService],
})
export class OperatingSystemModule {}
