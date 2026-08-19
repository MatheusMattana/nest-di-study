import { Module } from '@nestjs/common';
import { PowerModule } from '../power/power.module';
import { GpuService } from './gpu.service';

@Module({
  imports: [PowerModule],
  providers: [GpuService],
  exports: [GpuService],
})
export class GpuModule {}
