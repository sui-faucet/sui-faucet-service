import { Module } from '@nestjs/common';
import { SuiController } from './sui.controller';
import { SuiService } from './sui.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [SuiController],
  providers: [SuiService],
})
export class SuiModule { }
