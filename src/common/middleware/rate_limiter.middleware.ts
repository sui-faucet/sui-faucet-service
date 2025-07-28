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

  private async checkRateLimit(ip: string): Promise<boolean> {
    const ipKey = `faucet:ip:${ip}`;

    try {
      const systemSetting = await this.systemSettingService.findOne();

      const limitPerIp = systemSetting.limitPerIp;
      const ttlPerIp = systemSetting.ttlPerIp;

      // Increment and set TTL if new
      const ipCountRaw = await this.redisService.client
        .multi()
        .incr(ipKey)
        .expire(ipKey, ttlPerIp)
        .exec()
        .then((results) => (results ? results[0][1] : 0));
      const ipCount = Number(ipCountRaw);

      if (ipCount > limitPerIp) {
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

    if (!ip) {
      throw new HttpException(
        'IP address are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isRateLimitEnabled = await this.checkRateLimit(ip);
    if (!isRateLimitEnabled) {
      throw new HttpException(
        'Rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    next();
  }
}
