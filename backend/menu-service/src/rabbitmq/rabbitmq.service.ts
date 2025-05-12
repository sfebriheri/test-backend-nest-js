import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface MenuUpdateEvent {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  data: any;
  timestamp: Date;
}

export interface MenuItemUpdateEvent {
  type: 'PRICE_CHANGE' | 'AVAILABILITY_CHANGE' | 'STOCK_UPDATE';
  menuItemId: string;
  restaurantId: string;
  data: any;
  timestamp: Date;
}

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async publishMenuUpdate(event: MenuUpdateEvent) {
    return this.client.emit('menu.updates', event);
  }

  async publishMenuItemUpdate(event: MenuItemUpdateEvent) {
    return this.client.emit('menu.item.update', event);
  }

  async publishMenuItemAvailability(event: MenuItemUpdateEvent) {
    return this.client.emit('menu.item.availability', event);
  }

  async publishOrderStatusUpdate(orderId: string, status: string, metadata: any) {
    return this.client.emit('orders.status', {
      orderId,
      status,
      metadata,
      timestamp: new Date(),
    });
  }
} 