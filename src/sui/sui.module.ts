import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

import { SuiController } from './sui.controller';
import { SuiService } from './sui.service';
import { RedisModule } from '../redis/redis.module';
import { SystemSettingModule } from '../system_setting/system_setting.module';
import { RateLimiterMiddleware } from '../common/middleware/rate_limiter.middleware';

@Module({
  imports: [RedisModule, SystemSettingModule],
  controllers: [SuiController],
  providers: [SuiService],
})
export class SuiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes({
      path: 'v1/sui/faucet',
      method: RequestMethod.POST,
    });
  }
}
