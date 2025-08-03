import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SuiController } from './sui.controller';
import { SuiService } from './sui.service';
import { RedisModule } from '../redis/redis.module';
import { SystemSettingModule } from '../system_setting/system_setting.module';
import { RateLimiterMiddleware } from '../common/middleware/rate_limiter.middleware';
import { Transaction, TransactionSchema } from './schema/transaction.schema';

@Module({
  imports: [
    RedisModule,
    SystemSettingModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
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
