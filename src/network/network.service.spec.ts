import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { NetworkService } from './network.service';
import { PowerService } from '../power/power.service';

describe('NetworkService', () => {
  let service: NetworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkService, PowerService],
    }).compile();

    service = module.get<NetworkService>(NetworkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should refuse to ping while disconnected', () => {
    expect(() => service.ping('example.com')).toThrow(
      ServiceUnavailableException,
    );
  });

  it('should connect and then allow pinging', () => {
    service.connect('HomeWifi');

    expect(service.getStatus()).toEqual({
      connected: true,
      ssid: 'HomeWifi',
    });

    const result = service.ping('example.com');
    expect(result.host).toBe('example.com');
  });

  it('should reject connecting without an ssid', () => {
    expect(() => service.connect('')).toThrow(BadRequestException);
  });

  it('should disconnect', () => {
    service.connect('HomeWifi');
    service.disconnect();

    expect(service.getStatus()).toEqual({ connected: false, ssid: null });
  });
});
