import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RedisHealthIndicator {
  constructor(private readonly redisService: RedisService) {}

  async pingCheck(): Promise<HealthIndicatorResult> {
    try {
      // Ping Redis to check if it's responsive
      const result = await this.redisService.client.ping();

      if (result === 'PONG') {
        return {
          redis: {
            status: 'up',
            message: 'Redis is responding',
          },
        };
      } else {
        return {
          redis: {
            status: 'down',
            message: 'Redis ping failed',
          },
        };
      }
    } catch (error) {
      return {
        redis: {
          status: 'down',
          message: `Redis connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      };
    }
  }
}
