import { Test, TestingModule } from '@nestjs/testing';
import { MotherboardService } from './motherboard.service';
import { CpuService } from '../cpu/cpu.service';
import { MemoryService } from '../memory/memory.service';
import { DiskService } from '../disk/disk.service';
import { GpuService } from '../gpu/gpu.service';
import { NetworkService } from '../network/network.service';
import { PowerService } from '../power/power.service';

describe('MotherboardService', () => {
  let service: MotherboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MotherboardService,
        CpuService,
        MemoryService,
        DiskService,
        GpuService,
        NetworkService,
        PowerService,
      ],
    }).compile();

    service = module.get<MotherboardService>(MotherboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should run a POST check aggregating every component', () => {
    const result = service.postCheck();

    expect(result.status).toBe('OK');
    expect(result.memory.totalMb).toBe(16384);
    expect(result.gpu.model).toBe('DI-GTX Virtual');
  });

  it('should report the status of every component', () => {
    const result = service.getComponentsStatus();

    expect(result.cpu).toEqual({ cycles: 0 });
    expect(result.network).toEqual({ connected: false, ssid: null });
  });
});
