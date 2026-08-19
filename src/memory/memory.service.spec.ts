import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { MemoryService } from './memory.service';
import { PowerService } from '../power/power.service';

describe('MemoryService', () => {
  let service: MemoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemoryService, PowerService],
    }).compile();

    service = module.get<MemoryService>(MemoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should allocate and free memory blocks', () => {
    const block = service.allocate(128);

    expect(service.getStatus().usedMb).toBe(128);

    service.free(block.address);
    expect(service.getStatus().usedMb).toBe(0);
  });

  it('should reject invalid allocation sizes', () => {
    expect(() => service.allocate(0)).toThrow(BadRequestException);
  });

  it('should reject freeing an unknown address', () => {
    expect(() => service.free(999)).toThrow(NotFoundException);
  });

  it('should reject allocations beyond total memory', () => {
    expect(() => service.allocate(999_999)).toThrow(ConflictException);
  });
});
