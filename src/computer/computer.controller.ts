import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CpuService, CpuInstruction } from '../cpu/cpu.service';
import { DiskService } from '../disk/disk.service';
import { MemoryService } from '../memory/memory.service';
import { GpuService } from '../gpu/gpu.service';
import { NetworkService } from '../network/network.service';
import { MotherboardService } from '../motherboard/motherboard.service';
import { OperatingSystemService } from '../operating-system/operating-system.service';

@Controller('computer')
export class ComputerController {
  constructor(
    private cpuService: CpuService,
    private diskService: DiskService,
    private memoryService: MemoryService,
    private gpuService: GpuService,
    private networkService: NetworkService,
    private motherboardService: MotherboardService,
    private operatingSystemService: OperatingSystemService,
  ) {}

  @Get()
  run() {
    const cpuResult = this.cpuService.compute(5, 10);
    const diskData = this.diskService.getData();

    return { cpuResult, diskData };
  }

  // --- System / Operating system ---

  @Post('boot')
  boot() {
    return this.operatingSystemService.boot();
  }

  @Post('shutdown')
  shutdown() {
    return { message: this.operatingSystemService.shutdown() };
  }

  @Get('post')
  postCheck() {
    return this.motherboardService.postCheck();
  }

  @Get('status')
  getStatus() {
    return this.operatingSystemService.getSystemInfo();
  }

  @Get('processes')
  listProcesses() {
    return this.operatingSystemService.listProcesses();
  }

  @Post('processes')
  spawnProcess(@Body() body: { name: string; memorySize?: number }) {
    return this.operatingSystemService.spawnProcess(
      body.name,
      body.memorySize,
    );
  }

  @Delete('processes/:pid')
  killProcess(@Param('pid', ParseIntPipe) pid: number) {
    return { message: this.operatingSystemService.killProcess(pid) };
  }

  // --- CPU ---

  @Get('cpu/compute')
  cpuCompute(
    @Query('a', ParseIntPipe) a: number,
    @Query('b', ParseIntPipe) b: number,
  ) {
    return { result: this.cpuService.compute(a, b) };
  }

  @Get('cpu/multiply')
  cpuMultiply(
    @Query('a', ParseIntPipe) a: number,
    @Query('b', ParseIntPipe) b: number,
  ) {
    return { result: this.cpuService.multiply(a, b) };
  }

  @Get('cpu/divide')
  cpuDivide(
    @Query('a', ParseIntPipe) a: number,
    @Query('b', ParseIntPipe) b: number,
  ) {
    return { result: this.cpuService.divide(a, b) };
  }

  @Post('cpu/execute')
  cpuExecute(
    @Body() body: { instruction: CpuInstruction; a: number; b: number },
  ) {
    return { result: this.cpuService.execute(body.instruction, body.a, body.b) };
  }

  @Get('cpu/benchmark')
  cpuBenchmark(@Query('iterations') iterations?: string) {
    return this.cpuService.benchmark(
      iterations ? parseInt(iterations, 10) : undefined,
    );
  }

  // --- Memory ---

  @Post('memory/allocate')
  memoryAllocate(@Body() body: { size: number }) {
    return this.memoryService.allocate(body.size);
  }

  @Delete('memory/:address')
  memoryFree(@Param('address', ParseIntPipe) address: number) {
    return { message: this.memoryService.free(address) };
  }

  @Get('memory/status')
  memoryStatus() {
    return this.memoryService.getStatus();
  }

  // --- Disk ---

  @Get('disk')
  diskGetData() {
    return { data: this.diskService.getData() };
  }

  @Get('disk/files')
  diskList() {
    return this.diskService.list();
  }

  @Post('disk/files')
  diskWrite(@Body() body: { key: string; data: string }) {
    return this.diskService.write(body.key, body.data);
  }

  @Get('disk/files/:key')
  diskRead(@Param('key') key: string) {
    return { key, data: this.diskService.read(key) };
  }

  @Delete('disk/files/:key')
  diskDelete(@Param('key') key: string) {
    return { message: this.diskService.delete(key) };
  }

  @Post('disk/format')
  diskFormat() {
    return { message: this.diskService.format() };
  }

  @Get('disk/usage')
  diskUsage() {
    return this.diskService.getUsage();
  }

  // --- GPU ---

  @Post('gpu/render')
  gpuRender(@Body() body: { sceneComplexity: number }) {
    return this.gpuService.render(body.sceneComplexity);
  }

  @Get('gpu/specs')
  gpuSpecs() {
    return this.gpuService.getSpecs();
  }

  // --- Network ---

  @Post('network/connect')
  networkConnect(@Body() body: { ssid: string }) {
    return { message: this.networkService.connect(body.ssid) };
  }

  @Post('network/disconnect')
  networkDisconnect() {
    return { message: this.networkService.disconnect() };
  }

  @Get('network/ping')
  networkPing(@Query('host') host: string) {
    return this.networkService.ping(host);
  }

  @Get('network/status')
  networkStatus() {
    return this.networkService.getStatus();
  }
}
