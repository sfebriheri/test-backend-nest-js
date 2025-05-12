import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.prisma.order.create({
      data: {
        ...createOrderDto,
        orderNumber: this.generateOrderNumber(),
        status: 'PENDING',
        orderItems: {
          create: createOrderDto.items.map(item => ({
            quantity: item.quantity,
            price: item.price,
            notes: item.notes,
            menuItemId: item.menuItemId,
          })),
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            notes: 'Order created',
          },
        },
      },
      include: {
        orderItems: true,
        statusHistory: true,
      },
    });

    await this.rabbitmq.publishOrderUpdate({
      type: 'ORDER_CREATED',
      data: order,
    });

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        orderItems: true,
        statusHistory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        statusHistory: true,
      },
    });
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderStatusDto.status,
        statusHistory: {
          create: {
            status: updateOrderStatusDto.status,
            notes: updateOrderStatusDto.notes,
          },
        },
      },
      include: {
        orderItems: true,
        statusHistory: true,
      },
    });

    await this.rabbitmq.publishOrderUpdate({
      type: 'ORDER_STATUS_UPDATED',
      data: order,
    });

    return order;
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }
} 