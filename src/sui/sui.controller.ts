import { Controller, Get, Version, Post, Body } from '@nestjs/common';

import { SuiService } from './sui.service';
import { SystemSettingService } from '../system_setting/system_setting.service';
import { FaucetDto } from './dto/faucet.dto';

@Controller('sui')
export class SuiController {
  constructor(
    private readonly suiService: SuiService,
    private readonly systemSettingService: SystemSettingService,
  ) {}

  @Post('faucet')
  @Version('1')
  async faucet(@Body() body: FaucetDto) {
    const systemSetting = await this.systemSettingService.findOne();
    const result = this.suiService.transferSui(
      body.walletAddress,
      BigInt(systemSetting.suiFaucetAmount),
    );
    return result;
  }

  @Get('address')
  @Version('1')
  getAddress() {
    const address = this.suiService.getAddress();
    return address;
  }

  @Get('balance')
  @Version('1')
  getBalance() {
    const balance = this.suiService.getSuiBalance();
    return balance;
  }
}
