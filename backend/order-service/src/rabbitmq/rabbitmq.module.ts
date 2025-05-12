import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        useFactory: (configService: ConfigService) => {
          const url = configService.get<string>('RABBITMQ_URL');
          if (!url) {
            throw new Error('RABBITMQ_URL is not defined');
          }
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: 'order-service',
              queueOptions: {
                durable: true,
              },
              exchange: 'order_exchange',
              exchangeOptions: {
                type: 'topic',
                durable: true,
              },
              routingKeys: [
                'orders.incoming',
                'orders.status',
                'menu.updates',
              ],
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {} 