import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PowerService } from '../power/power.service';

export interface PingResult {
  host: string;
  latencyMs: number;
}

export interface NetworkStatus {
  connected: boolean;
  ssid: string | null;
}

@Injectable()
export class NetworkService {
  private connected = false;
  private ssid: string | null = null;

  constructor(private powerService: PowerService) {}

  connect(ssid: string): string {
    if (!ssid) {
      throw new BadRequestException('ssid is required');
    }

    this.powerService.supplyPower(20);
    this.connected = true;
    this.ssid = ssid;

    return `Connected to ${ssid}`;
  }

  disconnect(): string {
    this.connected = false;
    this.ssid = null;
    return 'Disconnected';
  }

  ping(host: string): PingResult {
    if (!host) {
      throw new BadRequestException('host is required');
    }

    if (!this.connected) {
      throw new ServiceUnavailableException('Not connected to any network');
    }

    this.powerService.supplyPower(5);
    const latencyMs = Math.floor(Math.random() * 100) + 1;

    return { host, latencyMs };
  }

  getStatus(): NetworkStatus {
    return { connected: this.connected, ssid: this.ssid };
  }
}
