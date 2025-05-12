import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async publishMenuUpdate(data: any) {
    return this.client.emit('menu.updates', data);
  }

  async publishMenuItemUpdate(data: any) {
    return this.client.emit('menu.item.update', data);
  }

  async publishMenuItemAvailability(data: any) {
    return this.client.emit('menu.item.availability', data);
  }
} 