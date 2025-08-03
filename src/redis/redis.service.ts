import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  client: Redis;

  constructor() {
    const host = process.env.REDIS_HOST;
    const port = parseInt(process.env.REDIS_PORT ?? '6379');
    const username = process.env.REDIS_USERNAME;
    const password = process.env.REDIS_PASSWORD;

    if (!host || !port || !username || !password) {
      throw new Error('Redis configuration is missing');
    }

    this.client = new Redis({
      host,
      port,
      username,
      password,
    });
  }
}
