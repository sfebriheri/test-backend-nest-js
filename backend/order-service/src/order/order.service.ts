import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface OrderEvent {
  type: 'ORDER_CREATED' | 'ORDER_STATUS_UPDATED' | 'ORDER_CANCELLED';
  orderId: string;
  restaurantId: string;
  data: any;
  timestamp: Date;
}

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
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        statusHistory: true,
      },
    });

    await this.rabbitmq.publishOrderUpdate({
      type: 'ORDER_CREATED',
      orderId: order.id,
      restaurantId: order.restaurantId,
      data: order,
      timestamp: new Date(),
    });

    return order;
  }

  async findAll(restaurantId?: string) {
    const where = restaurantId ? { restaurantId } : {};
    return this.prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        statusHistory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        statusHistory: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
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
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        statusHistory: true,
      },
    });

    await this.rabbitmq.publishOrderUpdate({
      type: 'ORDER_STATUS_UPDATED',
      orderId: order.id,
      restaurantId: order.restaurantId,
      data: order,
      timestamp: new Date(),
    });

    return order;
  }

  async cancelOrder(id: string, reason: string) {
    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        statusHistory: {
          create: {
            status: 'CANCELLED',
            notes: `Order cancelled: ${reason}`,
          },
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        statusHistory: true,
      },
    });

    await this.rabbitmq.publishOrderUpdate({
      type: 'ORDER_CANCELLED',
      orderId: order.id,
      restaurantId: order.restaurantId,
      data: order,
      timestamp: new Date(),
    });

    return order;
  }

  async getOrdersByStatus(restaurantId: string, status: OrderStatus) {
    return this.prisma.order.findMany({
      where: {
        restaurantId,
        status,
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        statusHistory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getOrdersByDateRange(restaurantId: string, startDate: Date, endDate: Date) {
    return this.prisma.order.findMany({
      where: {
        restaurantId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        statusHistory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }
} 