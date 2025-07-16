import { Module } from '@nestjs/common';
import { RabbitMqService } from './rabbit_mq.service';

@Module({
  providers: [RabbitMqService],
  exports: [RabbitMqService]
})
export class RabbitMqModule { }
