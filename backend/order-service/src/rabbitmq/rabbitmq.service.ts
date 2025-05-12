import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async publishOrderUpdate(data: any) {
    return this.client.emit('orders.status', data);
  }

  async publishOrderCreated(data: any) {
    return this.client.emit('orders.created', data);
  }

  async publishOrderStatusUpdate(data: any) {
    return this.client.emit('orders.status.updated', data);
  }
} 