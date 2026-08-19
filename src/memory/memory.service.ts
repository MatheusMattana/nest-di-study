import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PowerService } from '../power/power.service';

export interface MemoryBlock {
  address: number;
  size: number;
}

export interface MemoryStatus {
  totalMb: number;
  usedMb: number;
  freeMb: number;
  blocks: number;
}

@Injectable()
export class MemoryService {
  private readonly totalMb = 16384;
  private readonly blocks: MemoryBlock[] = [];
  private nextAddress = 0;

  constructor(private powerService: PowerService) {}

  allocate(size: number): MemoryBlock {
    if (size <= 0) {
      throw new BadRequestException('size must be greater than 0');
    }

    if (this.getUsedMb() + size > this.totalMb) {
      throw new ConflictException('Out of memory');
    }

    this.powerService.supplyPower(5);

    const block: MemoryBlock = { address: this.nextAddress, size };
    this.blocks.push(block);
    this.nextAddress += size;

    return block;
  }

  free(address: number): string {
    const index = this.blocks.findIndex((block) => block.address === address);

    if (index === -1) {
      throw new NotFoundException(`No memory block at address ${address}`);
    }

    this.blocks.splice(index, 1);
    return `Memory block at ${address} freed`;
  }

  getUsedMb(): number {
    return this.blocks.reduce((sum, block) => sum + block.size, 0);
  }

  getStatus(): MemoryStatus {
    const usedMb = this.getUsedMb();

    return {
      totalMb: this.totalMb,
      usedMb,
      freeMb: this.totalMb - usedMb,
      blocks: this.blocks.length,
    };
  }
}
