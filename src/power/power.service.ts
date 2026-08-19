import { Injectable, ServiceUnavailableException } from '@nestjs/common';

export interface PowerStatus {
  isOn: boolean;
  totalWattsSupplied: number;
}

@Injectable()
export class PowerService {
  private isOn = true;
  private totalWattsSupplied = 0;

  supplyPower(watts: number): string {
    if (!this.isOn) {
      throw new ServiceUnavailableException(
        'Cannot supply power: the power unit is switched off',
      );
    }

    this.totalWattsSupplied += watts;
    return `Power supplied: ${watts} watts`;
  }

  cutPower(): string {
    this.isOn = false;
    return 'Power cut';
  }

  restorePower(): string {
    this.isOn = true;
    return 'Power restored';
  }

  getStatus(): PowerStatus {
    return {
      isOn: this.isOn,
      totalWattsSupplied: this.totalWattsSupplied,
    };
  }
}
