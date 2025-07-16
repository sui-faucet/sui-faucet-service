import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMqService {
    async sendToQueue(message: string) {
        try {
            const connection = await amqp.connect(process.env.AMQP_URL ?? '');
            const channel = await connection.createChannel();
            const nameQueue = 'q1';

            await channel.assertQueue(nameQueue, {
                durable: false
            });

            await channel.sendToQueue(nameQueue, Buffer.from(message));
        } catch (error) {
            console.error(error);
        }
    }

    async receiveFromQueue() {
        try {
            const connection = await amqp.connect(process.env.AMQP_URL ?? '');
            const channel = await connection.createChannel();
            const nameQueue = 'q1';

            await channel.assertQueue(nameQueue, {
                durable: false
            });

            await channel.consume(nameQueue, (msg) => {
                console.log(msg?.content.toString());
            }, {
                noAck: true
            });
        } catch (error) {
            console.error(error);
        }
    }
}
