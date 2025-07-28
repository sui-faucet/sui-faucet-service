import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuiModule } from './sui/sui.module';
import { HealthModule } from './health/health.module';
import { SystemSettingModule } from './system_setting/system_setting.module';
import { RedisModule } from './redis/redis.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AnalyticsModule } from './analytics/analytics.module';

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
    AuthModule,
    UsersModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
