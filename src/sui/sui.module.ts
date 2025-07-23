import { Module } from '@nestjs/common';

import { SuiController } from './sui.controller';
import { SuiService } from './sui.service';
import { RedisModule } from '../redis/redis.module';
import { SystemSettingModule } from '../system_setting/system_setting.module';

@Module({
  imports: [RedisModule, SystemSettingModule],
  controllers: [SuiController],
  providers: [SuiService],
})
export class SuiModule {}
