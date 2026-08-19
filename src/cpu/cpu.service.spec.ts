import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CpuService } from './cpu.service';
import { PowerService } from '../power/power.service';

describe('CpuService', () => {
  let service: CpuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CpuService, PowerService],
    }).compile();

    service = module.get<CpuService>(CpuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should compute the four basic operations', () => {
    expect(service.compute(2, 3)).toBe(5);
    expect(service.subtract(5, 3)).toBe(2);
    expect(service.multiply(4, 3)).toBe(12);
    expect(service.divide(9, 3)).toBe(3);
  });

  it('should reject division by zero', () => {
    expect(() => service.divide(1, 0)).toThrow(BadRequestException);
  });

  it('should dispatch instructions via execute', () => {
    expect(service.execute('MUL', 6, 7)).toBe(42);
  });

  it('should track executed cycles', () => {
    service.compute(1, 1);
    service.multiply(2, 2);

    expect(service.getCycles()).toBe(2);
  });

  it('should run a benchmark and report cycles', () => {
    const result = service.benchmark(10);

    expect(result.iterations).toBe(10);
    expect(result.cyclesAfter).toBe(10);
  });
});
