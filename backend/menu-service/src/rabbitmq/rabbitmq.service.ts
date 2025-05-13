import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleDestroy {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async connect() {
    try {
      this.connection = await amqp.connect(this.configService.get('RABBITMQ_URL'));
      this.channel = await this.connection.createChannel();
      
      // Declare exchanges
      await this.channel.assertExchange('menu.updates', 'fanout', { durable: true });
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  private async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      console.error('Failed to close RabbitMQ connection:', error);
    }
  }

  async publishMenuUpdate(data: any) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    try {
      await this.channel.publish(
        'menu.updates',
        '',
        Buffer.from(JSON.stringify(data)),
        { persistent: true }
      );
    } catch (error) {
      console.error('Failed to publish menu update:', error);
      throw error;
    }
  }

  async publishMenuItemUpdate(event: MenuItemUpdateEvent) {
    return this.channel.publish('menu.item.update', '', Buffer.from(JSON.stringify(event)));
  }

  async publishMenuItemAvailability(event: MenuItemUpdateEvent) {
    return this.channel.publish('menu.item.availability', '', Buffer.from(JSON.stringify(event)));
  }

  async publishOrderStatusUpdate(orderId: string, status: string, metadata: any) {
    return this.channel.publish('orders.status', '', Buffer.from(JSON.stringify({
      orderId,
      status,
      metadata,
      timestamp: new Date(),
    })));
  }
} 