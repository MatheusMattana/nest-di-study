import { BadRequestException, Injectable } from '@nestjs/common';
import { PowerService } from '../power/power.service';

export interface RenderResult {
  sceneComplexity: number;
  framesPerSecond: number;
}

export interface GpuSpecs {
  model: string;
  vramMb: number;
  cores: number;
}

@Injectable()
export class GpuService {
  private readonly specs: GpuSpecs = {
    model: 'DI-GTX Virtual',
    vramMb: 8192,
    cores: 2048,
  };

  constructor(private powerService: PowerService) {}

  render(sceneComplexity: number): RenderResult {
    if (sceneComplexity <= 0) {
      throw new BadRequestException('sceneComplexity must be greater than 0');
    }

    this.powerService.supplyPower(150 + sceneComplexity * 10);

    const framesPerSecond = Math.max(1, Math.floor(240 / sceneComplexity));
    return { sceneComplexity, framesPerSecond };
  }

  getSpecs(): GpuSpecs {
    return this.specs;
  }
}
