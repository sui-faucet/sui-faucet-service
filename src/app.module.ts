import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuiModule } from './sui/sui.module';
import { HealthModule } from './health/health.module';
import { SystemSettingModule } from './system_setting/system_setting.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
