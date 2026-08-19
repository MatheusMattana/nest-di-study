import { Module } from '@nestjs/common';
import { CpuModule } from '../cpu/cpu.module';
import { MemoryModule } from '../memory/memory.module';
import { DiskModule } from '../disk/disk.module';
import { GpuModule } from '../gpu/gpu.module';
import { NetworkModule } from '../network/network.module';
import { PowerModule } from '../power/power.module';
import { MotherboardService } from './motherboard.service';

@Module({
  imports: [
    CpuModule,
    MemoryModule,
    DiskModule,
    GpuModule,
    NetworkModule,
    PowerModule,
  ],
  providers: [MotherboardService],
  exports: [MotherboardService],
})
export class MotherboardModule {}
