import { Injectable } from '@nestjs/common';
import { CpuService } from '../cpu/cpu.service';
import { MemoryService, MemoryStatus } from '../memory/memory.service';
import { DiskService, DiskUsage } from '../disk/disk.service';
import { GpuService, GpuSpecs } from '../gpu/gpu.service';
import { NetworkService, NetworkStatus } from '../network/network.service';
import { PowerService, PowerStatus } from '../power/power.service';

export interface PostCheckResult {
  status: 'OK';
  power: PowerStatus;
  memory: MemoryStatus;
  disk: DiskUsage;
  gpu: GpuSpecs;
}

export interface ComponentsStatus {
  cpu: { cycles: number };
  memory: MemoryStatus;
  disk: DiskUsage;
  network: NetworkStatus;
  power: PowerStatus;
}

@Injectable()
export class MotherboardService {
  constructor(
    private cpuService: CpuService,
    private memoryService: MemoryService,
    private diskService: DiskService,
    private gpuService: GpuService,
    private networkService: NetworkService,
    private powerService: PowerService,
  ) {}

  postCheck(): PostCheckResult {
    return {
      status: 'OK',
      power: this.powerService.getStatus(),
      memory: this.memoryService.getStatus(),
      disk: this.diskService.getUsage(),
      gpu: this.gpuService.getSpecs(),
    };
  }

  getComponentsStatus(): ComponentsStatus {
    return {
      cpu: { cycles: this.cpuService.getCycles() },
      memory: this.memoryService.getStatus(),
      disk: this.diskService.getUsage(),
      network: this.networkService.getStatus(),
      power: this.powerService.getStatus(),
    };
  }
}
