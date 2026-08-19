import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { PowerService } from './power.service';

describe('PowerService', () => {
  let service: PowerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PowerService],
    }).compile();

    service = module.get<PowerService>(PowerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should accumulate supplied watts', () => {
    service.supplyPower(10);
    service.supplyPower(15);

    expect(service.getStatus()).toEqual({
      isOn: true,
      totalWattsSupplied: 25,
    });
  });

  it('should refuse to supply power once cut', () => {
    service.cutPower();

    expect(() => service.supplyPower(10)).toThrow(ServiceUnavailableException);
  });

  it('should supply power again once restored', () => {
    service.cutPower();
    service.restorePower();

    expect(service.supplyPower(5)).toBe('Power supplied: 5 watts');
  });
});
