import {
  Controller,
  Post,
  Body,
  Get,
  Version,
  UseGuards,
} from '@nestjs/common';

import { SystemSettingService } from './system_setting.service';
import { CreateSystemSettingDto } from './dto/system_setting.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('system-setting')
export class SystemSettingController {
  constructor(private readonly systemSettingService: SystemSettingService) {}

  @Post()
  @Version('1')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createSystemSettingDto: CreateSystemSettingDto) {
    return this.systemSettingService.create(createSystemSettingDto);
  }

  @Get()
  @Version('1')
  findOne() {
    return this.systemSettingService.findOne();
  }
}
