import { Controller, Get, Version, Post, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { SuiService } from './sui.service';
import { SystemSettingService } from '../system_setting/system_setting.service';
import { FaucetDto } from './dto/faucet.dto';

@ApiTags('sui')
@Controller('sui')
export class SuiController {
  constructor(
    private readonly suiService: SuiService,
    private readonly systemSettingService: SystemSettingService,
  ) {}

  @Post('faucet')
  @Version('1')
  @ApiOperation({ summary: 'Transfer SUI tokens to target address' })
  @ApiResponse({
    status: 200,
    description: 'Transfer successful',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async faucet(@Body() body: FaucetDto, @Req() req: Request) {
    const systemSetting = await this.systemSettingService.findOne();
    const startTime = Date.now();

    try {
      const result = await this.suiService.transferSui(
        body.walletAddress,
        systemSetting.normalizedAmount,
      );

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      await this.suiService.saveTransaction(
        result,
        req.ip || 'Unknown',
        body.walletAddress,
        req.headers['user-agent'] || 'Unknown',
        responseTime,
      );

      return result;
    } catch (error) {
      // Calculate response time for failed transactions
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Save failed transaction information
      await this.suiService.saveFailedTransaction(
        {
          error,
          ipAddress: req.ip || 'Unknown',
          walletAddress: body.walletAddress,
          userAgent: req.headers['user-agent'] || 'Unknown',
          responseTime,
        }
      );

      throw error;
    }
  }

  @Get('address')
  @Version('1')
  @ApiOperation({ summary: 'Get SUI address of source' })
  @ApiResponse({
    status: 200,
    description: 'Address of source retrieved successfully',
  })
  getAddress() {
    const address = this.suiService.getAddress();
    return address;
  }

  @Get('balance')
  @Version('1')
  @ApiOperation({ summary: 'Get SUI balance of source address' })
  @ApiResponse({
    status: 200,
    description: 'Balance of source address retrieved successfully',
  })
  getBalance() {
    const balance = this.suiService.getSuiBalance();
    return balance;
  }
}
