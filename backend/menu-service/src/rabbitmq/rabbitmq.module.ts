import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RabbitMQService } from './rabbitmq.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        useFactory: (configService: ConfigService) => {
          const url = configService.get<string>('RABBITMQ_URL');
          if (!url) throw new Error('RABBITMQ_URL is not defined');
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: 'menu-service',
              queueOptions: {
                durable: true,
              },
              exchange: 'menu_exchange',
              exchangeOptions: {
                type: 'topic',
                durable: true,
              },
              routingKeys: [
                'menu.updates',
                'menu.item.update',
                'menu.item.availability',
                'orders.status',
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