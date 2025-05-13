import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private rabbitmq: RabbitMQService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: createCategoryDto,
      include: {
        items: true,
        restaurant: true,
      },
    });

    // Invalidate restaurant cache
    await this.redis.del(`restaurant:${category.restaurantId}`);
    await this.redis.del('restaurants:all');

    // Publish menu update event
    await this.rabbitmq.publishMenuUpdate({
      type: 'CATEGORY_CREATED',
      restaurantId: category.restaurantId,
      categoryId: category.id,
      data: category,
    });

    return category;
  }

  async findAll(restaurantId: string) {
    const categories = await this.prisma.category.findMany({
      where: { restaurantId },
      include: {
        items: true,
        restaurant: true,
      },
    });

    return categories;
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        items: true,
        restaurant: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        items: true,
        restaurant: true,
      },
    });

    // Invalidate restaurant cache
    await this.redis.del(`restaurant:${category.restaurantId}`);
    await this.redis.del('restaurants:all');

    // Publish menu update event
    await this.rabbitmq.publishMenuUpdate({
      type: 'CATEGORY_UPDATED',
      restaurantId: category.restaurantId,
      categoryId: category.id,
      data: category,
    });

    return category;
  }

  async remove(id: string) {
    const category = await this.prisma.category.delete({
      where: { id },
      include: {
        restaurant: true,
      },
    });

    // Invalidate restaurant cache
    await this.redis.del(`restaurant:${category.restaurantId}`);
    await this.redis.del('restaurants:all');

    // Publish menu update event
    await this.rabbitmq.publishMenuUpdate({
      type: 'CATEGORY_DELETED',
      restaurantId: category.restaurantId,
      categoryId: id,
    });

    return category;
  }
} 