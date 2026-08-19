import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DiskService } from './disk.service';
import { PowerService } from '../power/power.service';

describe('DiskService', () => {
  let service: DiskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiskService, PowerService],
    }).compile();

    service = module.get<DiskService>(DiskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should write and read a file', () => {
    service.write('notes.txt', 'hello world');

    expect(service.read('notes.txt')).toBe('hello world');
  });

  it('should throw when reading a missing file', () => {
    expect(() => service.read('missing.txt')).toThrow(NotFoundException);
  });

  it('should list and delete files', () => {
    service.write('a.txt', '1');
    service.write('b.txt', '22');

    expect(service.list().sort()).toEqual(['a.txt', 'b.txt']);

    service.delete('a.txt');
    expect(service.list()).toEqual(['b.txt']);
  });

  it('should report usage', () => {
    service.write('a.txt', '123');

    expect(service.getUsage()).toEqual({ files: 1, bytes: 3 });
  });

  it('should format the disk', () => {
    service.write('a.txt', '123');
    service.format();

    expect(service.list()).toEqual([]);
  });
});
