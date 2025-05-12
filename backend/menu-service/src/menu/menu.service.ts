import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { RedisService } from '../redis/redis.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQService,
    private readonly redis: RedisService,
  ) {}

  // Category operations
  async createCategory(restaurantId: string, createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.menuCategory.create({
      data: {
        ...createCategoryDto,
        restaurantId,
      },
    });
    await this.redis.invalidateMenu(restaurantId);
    await this.rabbitmq.publishMenuUpdate({
      type: 'CATEGORY_CREATED',
      data: category,
    });
    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.menuCategory.update({
      where: { id },
      data: updateCategoryDto,
    });
    await this.redis.invalidateMenu(category.restaurantId);
    await this.rabbitmq.publishMenuUpdate({
      type: 'CATEGORY_UPDATED',
      data: category,
    });
    return category;
  }

  async removeCategory(id: string) {
    const category = await this.prisma.menuCategory.delete({
      where: { id },
    });
    await this.redis.invalidateMenu(category.restaurantId);
    await this.rabbitmq.publishMenuUpdate({
      type: 'CATEGORY_DELETED',
      data: category,
    });
    return category;
  }

  // Menu item operations
  async createMenuItem(restaurantId: string, createMenuItemDto: CreateMenuItemDto) {
    const menuItem = await this.prisma.menuItem.create({
      data: {
        ...createMenuItemDto,
        restaurantId,
      },
    });
    await this.redis.invalidateMenu(restaurantId);
    await this.rabbitmq.publishMenuItemUpdate({
      type: 'ITEM_CREATED',
      data: menuItem,
    });
    return menuItem;
  }

  async updateMenuItem(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    const menuItem = await this.prisma.menuItem.update({
      where: { id },
      data: updateMenuItemDto,
    });
    await this.redis.invalidateMenu(menuItem.restaurantId);
    await this.rabbitmq.publishMenuItemUpdate({
      type: 'ITEM_UPDATED',
      data: menuItem,
    });
    return menuItem;
  }

  async updateMenuItemAvailability(id: string, isAvailable: boolean) {
    const menuItem = await this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable },
    });
    await this.redis.invalidateMenu(menuItem.restaurantId);
    await this.rabbitmq.publishMenuItemAvailability({
      type: 'ITEM_AVAILABILITY_UPDATED',
      data: menuItem,
    });
    return menuItem;
  }

  async removeMenuItem(id: string) {
    const menuItem = await this.prisma.menuItem.delete({
      where: { id },
    });
    await this.redis.invalidateMenu(menuItem.restaurantId);
    await this.rabbitmq.publishMenuItemUpdate({
      type: 'ITEM_DELETED',
      data: menuItem,
    });
    return menuItem;
  }
} 