import { Module } from '@nestjs/common';
import { CpuModule } from '../cpu/cpu.module';
import { DiskModule } from '../disk/disk.module';
import { MemoryModule } from '../memory/memory.module';
import { GpuModule } from '../gpu/gpu.module';
import { NetworkModule } from '../network/network.module';
import { MotherboardModule } from '../motherboard/motherboard.module';
import { OperatingSystemModule } from '../operating-system/operating-system.module';
import { ComputerController } from './computer.controller';

@Module({
  imports: [
    CpuModule,
    DiskModule,
    MemoryModule,
    GpuModule,
    NetworkModule,
    MotherboardModule,
    OperatingSystemModule,
  ],
  controllers: [ComputerController],
})
export class ComputerModule {}
