import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';


import { HealthController } from './health.controller';
import { RedisModule } from '../redis/redis.module';
import { RedisHealthIndicator } from './redis.health';
import { MongoHealthIndicator } from './mongo.health';

@Module({
    imports: [TerminusModule, RedisModule],
    controllers: [HealthController],
    providers: [RedisHealthIndicator, MongoHealthIndicator],
})
export class HealthModule { }
