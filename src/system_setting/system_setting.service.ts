import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SystemSetting } from './schema/system_setting.schema';
import { CreateSystemSettingDto } from './dto/system_setting.dto';

@Injectable()
export class SystemSettingService {
    constructor(@InjectModel(SystemSetting.name) private systemSettingModel: Model<SystemSetting>) { }

    async create(createSystemSettingDto: CreateSystemSettingDto): Promise<SystemSetting> {
        const existingSystemSetting = await this.systemSettingModel.findOne().exec();
        if (existingSystemSetting) {
            throw new BadRequestException('System setting already exists');
        }
        const createdSystemSetting = new this.systemSettingModel(createSystemSettingDto);
        return createdSystemSetting.save();
    }

    async findOne(): Promise<SystemSetting> {
        const systemSetting = await this.systemSettingModel.findOne().exec();
        if (!systemSetting) {
            throw new NotFoundException('System setting not found');
        }
        return systemSetting;
    }
}
