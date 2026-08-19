import { Injectable, NotFoundException } from '@nestjs/common';
import { PowerService } from '../power/power.service';

export interface DiskUsage {
  files: number;
  bytes: number;
}

@Injectable()
export class DiskService {
  private readonly storage = new Map<string, string>();

  constructor(private powerService: PowerService) {}

  getData(): string {
    this.powerService.supplyPower(50);
    return 'Disk data';
  }

  write(key: string, data: string): { key: string; bytes: number } {
    this.powerService.supplyPower(60);
    this.storage.set(key, data);
    return { key, bytes: data.length };
  }

  read(key: string): string {
    this.powerService.supplyPower(30);
    const data = this.storage.get(key);

    if (data === undefined) {
      throw new NotFoundException(`File "${key}" not found`);
    }

    return data;
  }

  delete(key: string): string {
    const existed = this.storage.delete(key);

    if (!existed) {
      throw new NotFoundException(`File "${key}" not found`);
    }

    return `File "${key}" deleted`;
  }

  list(): string[] {
    return Array.from(this.storage.keys());
  }

  format(): string {
    this.storage.clear();
    return 'Disk formatted';
  }

  getUsage(): DiskUsage {
    let bytes = 0;
    for (const value of this.storage.values()) {
      bytes += value.length;
    }

    return { files: this.storage.size, bytes };
  }
}
