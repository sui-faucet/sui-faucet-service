import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SuiService {
    constructor(private readonly redisService: RedisService) { }
}
