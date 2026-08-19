import { BadRequestException, Injectable } from '@nestjs/common';
import { PowerService } from '../power/power.service';

export type CpuInstruction = 'ADD' | 'SUB' | 'MUL' | 'DIV';

export interface BenchmarkResult {
  iterations: number;
  durationMs: number;
  cyclesAfter: number;
}

@Injectable()
export class CpuService {
  private cycles = 0;

  constructor(private powerService: PowerService) {}

  compute(a: number, b: number): number {
    this.powerService.supplyPower(100);
    this.cycles++;
    return a + b;
  }

  subtract(a: number, b: number): number {
    this.powerService.supplyPower(90);
    this.cycles++;
    return a - b;
  }

  multiply(a: number, b: number): number {
    this.powerService.supplyPower(120);
    this.cycles++;
    return a * b;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new BadRequestException('Division by zero');
    }

    this.powerService.supplyPower(80);
    this.cycles++;
    return a / b;
  }

  execute(instruction: CpuInstruction, a: number, b: number): number {
    switch (instruction) {
      case 'ADD':
        return this.compute(a, b);
      case 'SUB':
        return this.subtract(a, b);
      case 'MUL':
        return this.multiply(a, b);
      case 'DIV':
        return this.divide(a, b);
      default:
        throw new BadRequestException(`Unknown instruction: ${instruction}`);
    }
  }

  benchmark(iterations = 1000): BenchmarkResult {
    if (iterations <= 0) {
      throw new BadRequestException('iterations must be greater than 0');
    }

    const start = Date.now();
    for (let i = 0; i < iterations; i++) {
      this.compute(i, i + 1);
    }
    const durationMs = Date.now() - start;

    return { iterations, durationMs, cyclesAfter: this.cycles };
  }

  getCycles(): number {
    return this.cycles;
  }
}
