import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { SystemSettingService } from '../../system_setting/system_setting.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  constructor(
    private readonly systemSettingService: SystemSettingService,
    private readonly redisService: RedisService,
  ) {}

  private async checkRateLimit(ip: string, wallet: string): Promise<boolean> {
    const ipKey = `faucet:ip:${ip}`;
    const walletKey = `faucet:wallet:${wallet}`;

    try {
      const systemSetting = await this.systemSettingService.findOne();

      const limitPerIp = systemSetting.limitPerIp;
      const ttlPerIp = systemSetting.ttlPerIp;

      const limitPerWalletAddress = systemSetting.limitPerWalletAddress;
      const ttlPerWalletAddress = systemSetting.ttlPerWalletAddress;

      // Increment and set TTL if new
      const [ipCountRaw, walletCountRaw] = await Promise.all([
        this.redisService.client
          .multi()
          .incr(ipKey)
          .expire(ipKey, ttlPerIp)
          .exec()
          .then((results) => (results ? results[0][1] : 0)),
        this.redisService.client
          .multi()
          .incr(walletKey)
          .expire(walletKey, ttlPerWalletAddress)
          .exec()
          .then((results) => (results ? results[0][1] : 0)),
      ]);

      const ipCount = Number(ipCountRaw);
      const walletCount = Number(walletCountRaw);
      
      if (ipCount > limitPerIp || walletCount > limitPerWalletAddress) {
        return false;
      }
      return true;
    } catch (err) {
      console.error('Rate limit check failed:', err);
      return true;
    }
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;

    const walletAddress = req.body?.walletAddress as string;

    if (!walletAddress || !ip) {
      throw new HttpException(
        'Wallet address and IP address are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isRateLimitEnabled = await this.checkRateLimit(ip, walletAddress);
    if (!isRateLimitEnabled) {
      throw new HttpException(
        'Rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    next();
  }
}
