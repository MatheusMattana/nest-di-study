import { Test, TestingModule } from '@nestjs/testing';
import { ComputerController } from './computer.controller';
import { CpuService } from '../cpu/cpu.service';
import { DiskService } from '../disk/disk.service';
import { MemoryService } from '../memory/memory.service';
import { GpuService } from '../gpu/gpu.service';
import { NetworkService } from '../network/network.service';
import { MotherboardService } from '../motherboard/motherboard.service';
import { OperatingSystemService } from '../operating-system/operating-system.service';
import { PowerService } from '../power/power.service';

describe('ComputerController', () => {
  let controller: ComputerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComputerController],
      providers: [
        CpuService,
        DiskService,
        MemoryService,
        GpuService,
        NetworkService,
        MotherboardService,
        OperatingSystemService,
        PowerService,
      ],
    }).compile();

    controller = module.get<ComputerController>(ComputerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should run the default cpu + disk demo', () => {
    expect(controller.run()).toEqual({
      cpuResult: 15,
      diskData: 'Disk data',
    });
  });

  it('should boot the system and report its status', () => {
    const boot = controller.boot();
    expect(boot.message).toBe('System booted successfully');

    const status = controller.getStatus();
    expect(status.cpu).toEqual({ cycles: 0 });
  });

  it('should spawn and kill a process once booted', () => {
    controller.boot();

    const process = controller.spawnProcess({ name: 'shell', memorySize: 16 });
    expect(controller.listProcesses()).toHaveLength(1);

    controller.killProcess(process.pid);
    expect(controller.listProcesses()).toHaveLength(0);
  });
});
