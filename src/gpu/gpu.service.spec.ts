import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { GpuService } from './gpu.service';
import { PowerService } from '../power/power.service';

describe('GpuService', () => {
  let service: GpuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GpuService, PowerService],
    }).compile();

    service = module.get<GpuService>(GpuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should render a scene and report fps', () => {
    expect(service.render(24)).toEqual({
      sceneComplexity: 24,
      framesPerSecond: 10,
    });
  });

  it('should reject an invalid scene complexity', () => {
    expect(() => service.render(0)).toThrow(BadRequestException);
  });

  it('should expose its specs', () => {
    expect(service.getSpecs().model).toBe('DI-GTX Virtual');
  });
});
