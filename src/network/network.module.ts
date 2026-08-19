import { Module } from '@nestjs/common';
import { PowerModule } from '../power/power.module';
import { NetworkService } from './network.service';

@Module({
  imports: [PowerModule],
  providers: [NetworkService],
  exports: [NetworkService],
})
export class NetworkModule {}
