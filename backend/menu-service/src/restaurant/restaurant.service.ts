import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { RedisService } from '../redis/redis.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQService,
    private readonly redis: RedisService,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    const restaurant = await this.prisma.restaurant.create({
      data: createRestaurantDto,
    });
    await this.rabbitmq.publishMenuUpdate({
      type: 'RESTAURANT_CREATED',
      data: restaurant,
    });
    return restaurant;
  }

  async findAll() {
    return this.prisma.restaurant.findMany({
      where: { isActive: true },
      include: {
        menuCategories: {
          include: {
            menuItems: true,
          },
        },
        operatingHours: true,
      },
    });
  }

  async findOne(id: string) {
    const cached = await this.redis.getMenu(id);
    if (cached) {
      return JSON.parse(cached);
    }

    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuCategories: {
          include: {
            menuItems: true,
          },
        },
        operatingHours: true,
      },
    });

    if (restaurant) {
      await this.redis.setMenu(id, JSON.stringify(restaurant));
    }

    return restaurant;
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.prisma.restaurant.update({
      where: { id },
      data: updateRestaurantDto,
    });
    await this.redis.invalidateMenu(id);
    await this.rabbitmq.publishMenuUpdate({
      type: 'RESTAURANT_UPDATED',
      data: restaurant,
    });
    return restaurant;
  }

  async remove(id: string) {
    const restaurant = await this.prisma.restaurant.update({
      where: { id },
      data: { isActive: false },
    });
    await this.redis.invalidateMenu(id);
    await this.rabbitmq.publishMenuUpdate({
      type: 'RESTAURANT_DELETED',
      data: restaurant,
    });
    return restaurant;
  }
} 