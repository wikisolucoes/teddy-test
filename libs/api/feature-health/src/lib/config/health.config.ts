import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthConfig {
  constructor(private readonly configService: ConfigService) {}

  get memoryThresholdBytes(): number {
    const mb = parseInt(
      this.configService.get<string>('HEALTH_MEMORY_THRESHOLD_MB', '300')
    );
    return mb * 1024 * 1024;
  }

  get diskThresholdPercent(): number {
    return parseFloat(
      this.configService.get<string>('HEALTH_DISK_THRESHOLD_PERCENT', '0.9')
    );
  }
}
