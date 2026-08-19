import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  MotherboardService,
  PostCheckResult,
  ComponentsStatus,
} from '../motherboard/motherboard.service';
import { MemoryService } from '../memory/memory.service';

export interface OsProcess {
  pid: number;
  name: string;
  memoryAddress: number;
  memorySize: number;
}

export interface BootResult {
  message: string;
  post: PostCheckResult;
}

@Injectable()
export class OperatingSystemService {
  private booted = false;
  private readonly processes: OsProcess[] = [];
  private nextPid = 1;

  constructor(
    private motherboardService: MotherboardService,
    private memoryService: MemoryService,
  ) {}

  boot(): BootResult {
    if (this.booted) {
      throw new ConflictException('System is already running');
    }

    const post = this.motherboardService.postCheck();
    this.booted = true;

    return { message: 'System booted successfully', post };
  }

  shutdown(): string {
    this.ensureBooted();

    this.processes.length = 0;
    this.booted = false;

    return 'System shut down';
  }

  isRunning(): boolean {
    return this.booted;
  }

  spawnProcess(name: string, memorySize = 64): OsProcess {
    this.ensureBooted();

    const block = this.memoryService.allocate(memorySize);
    const process: OsProcess = {
      pid: this.nextPid++,
      name,
      memoryAddress: block.address,
      memorySize: block.size,
    };

    this.processes.push(process);
    return process;
  }

  killProcess(pid: number): string {
    this.ensureBooted();

    const index = this.processes.findIndex((process) => process.pid === pid);
    if (index === -1) {
      throw new NotFoundException(`No process with pid ${pid}`);
    }

    const [process] = this.processes.splice(index, 1);
    this.memoryService.free(process.memoryAddress);

    return `Process ${pid} killed`;
  }

  listProcesses(): OsProcess[] {
    return this.processes;
  }

  getSystemInfo(): ComponentsStatus {
    this.ensureBooted();
    return this.motherboardService.getComponentsStatus();
  }

  private ensureBooted(): void {
    if (!this.booted) {
      throw new ServiceUnavailableException(
        'System is not booted. Call POST /computer/boot first.',
      );
    }
  }
}
