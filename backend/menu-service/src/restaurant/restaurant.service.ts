import { Injectable, NotFoundException } from '@nestjs/common';
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
      include: {
        categories: true,
        images: true,
      },
    });

    await this.rabbitmq.publishMenuUpdate({
      type: 'RESTAURANT_CREATED',
      restaurantId: restaurant.id,
      data: restaurant,
    });

    return restaurant;
  }

  async findAll() {
    const cached = await this.redis.get('restaurants:all');
    if (cached) {
      return cached;
    }

    const restaurants = await this.prisma.restaurant.findMany({
      include: {
        categories: true,
        images: true,
      },
    });

    await this.redis.set('restaurants:all', restaurants, 3600);

    return restaurants;
  }

  async findOne(id: string) {
    const cached = await this.redis.get(`restaurant:${id}`);
    if (cached) {
      return cached;
    }

    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        categories: true,
        images: true,
      },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    await this.redis.set(`restaurant:${id}`, restaurant, 3600);

    return restaurant;
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.prisma.restaurant.update({
      where: { id },
      data: updateRestaurantDto,
      include: {
        categories: true,
        images: true,
      },
    });

    await this.redis.del(`restaurant:${id}`);
    await this.redis.del('restaurants:all');

    await this.rabbitmq.publishMenuUpdate({
      type: 'RESTAURANT_UPDATED',
      restaurantId: restaurant.id,
      data: restaurant,
    });

    return restaurant;
  }

  async remove(id: string) {
    const restaurant = await this.prisma.restaurant.delete({
      where: { id },
    });

    await this.redis.del(`restaurant:${id}`);
    await this.redis.del('restaurants:all');

    await this.rabbitmq.publishMenuUpdate({
      type: 'RESTAURANT_DELETED',
      restaurantId: id,
    });

    return restaurant;
  }
} 