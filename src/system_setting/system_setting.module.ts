import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SystemSettingController } from './system_setting.controller';
import { SystemSettingService } from './system_setting.service';
import {
  SystemSetting,
  SystemSettingSchema,
} from './schema/system_setting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SystemSetting.name, schema: SystemSettingSchema },
    ]),
  ],
  exports: [SystemSettingService],
  controllers: [SystemSettingController],
  providers: [SystemSettingService],
})
export class SystemSettingModule {}
