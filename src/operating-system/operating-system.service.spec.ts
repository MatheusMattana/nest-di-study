import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { OperatingSystemService } from './operating-system.service';
import { MotherboardService } from '../motherboard/motherboard.service';
import { CpuService } from '../cpu/cpu.service';
import { MemoryService } from '../memory/memory.service';
import { DiskService } from '../disk/disk.service';
import { GpuService } from '../gpu/gpu.service';
import { NetworkService } from '../network/network.service';
import { PowerService } from '../power/power.service';

describe('OperatingSystemService', () => {
  let service: OperatingSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperatingSystemService,
        MotherboardService,
        CpuService,
        MemoryService,
        DiskService,
        GpuService,
        NetworkService,
        PowerService,
      ],
    }).compile();

    service = module.get<OperatingSystemService>(OperatingSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should refuse actions before boot', () => {
    expect(() => service.spawnProcess('shell')).toThrow(
      ServiceUnavailableException,
    );
  });

  it('should boot and refuse a second boot', () => {
    const result = service.boot();

    expect(result.message).toBe('System booted successfully');
    expect(service.isRunning()).toBe(true);
    expect(() => service.boot()).toThrow(ConflictException);
  });

  it('should spawn and kill processes once booted', () => {
    service.boot();

    const process = service.spawnProcess('shell', 32);
    expect(service.listProcesses()).toHaveLength(1);

    service.killProcess(process.pid);
    expect(service.listProcesses()).toHaveLength(0);
  });

  it('should reject killing an unknown pid', () => {
    service.boot();

    expect(() => service.killProcess(999)).toThrow(NotFoundException);
  });

  it('should clear processes on shutdown', () => {
    service.boot();
    service.spawnProcess('shell');
    service.shutdown();

    expect(service.isRunning()).toBe(false);
  });
});
