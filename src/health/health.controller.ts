import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.health';
import { MongoHealthIndicator } from './mongo.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoHealthIndicator: MongoHealthIndicator,
    private redisHealthIndicator: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongoHealthIndicator.pingCheck(),
      () => this.redisHealthIndicator.pingCheck(),
    ]);
  }
}
