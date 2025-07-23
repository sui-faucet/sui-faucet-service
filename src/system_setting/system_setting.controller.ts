import { Controller, Post, Body, Get, Version } from '@nestjs/common';

import { SystemSettingService } from './system_setting.service';
import { CreateSystemSettingDto } from './dto/system_setting.dto';

@Controller('system-setting')
export class SystemSettingController {
    constructor(private readonly systemSettingService: SystemSettingService) { }

    @Post()
    @Version('1')
    create(@Body() createSystemSettingDto: CreateSystemSettingDto) {
        return this.systemSettingService.create(createSystemSettingDto);
    }

    @Get()
    @Version('1')
    findOne() {
        return this.systemSettingService.findOne();
    }
}
