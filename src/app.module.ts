import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuiModule } from './sui/sui.module';
import { HealthModule } from './health/health.module';
import { RateLimiterMiddleware } from './common/middleware/rate_limiter.middleware';
import { SystemSettingModule } from './system_setting/system_setting.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HealthModule,
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING || '', {
      dbName: process.env.MONGODB_DATABASE_NAME || 'faucet',
    }),
    SuiModule,
    SystemSettingModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('*');
  }
}
