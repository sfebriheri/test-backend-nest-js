import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQService, MenuUpdateEvent, MenuItemUpdateEvent } from '../rabbitmq/rabbitmq.service';
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
      type: 'CREATE',
      data: category,
      timestamp: new Date(),
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
      type: 'UPDATE',
      data: category,
      timestamp: new Date(),
    });
    return category;
  }

  async removeCategory(id: string) {
    const category = await this.prisma.menuCategory.delete({
      where: { id },
    });
    await this.redis.invalidateMenu(category.restaurantId);
    await this.rabbitmq.publishMenuUpdate({
      type: 'DELETE',
      data: category,
      timestamp: new Date(),
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
      type: 'PRICE_CHANGE',
      menuItemId: menuItem.id,
      restaurantId,
      data: menuItem,
      timestamp: new Date(),
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
      type: 'PRICE_CHANGE',
      menuItemId: menuItem.id,
      restaurantId: menuItem.restaurantId,
      data: menuItem,
      timestamp: new Date(),
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
      type: 'AVAILABILITY_CHANGE',
      menuItemId: menuItem.id,
      restaurantId: menuItem.restaurantId,
      data: { isAvailable },
      timestamp: new Date(),
    });
    return menuItem;
  }

  async removeMenuItem(id: string) {
    const menuItem = await this.prisma.menuItem.delete({
      where: { id },
    });
    await this.redis.invalidateMenu(menuItem.restaurantId);
    await this.rabbitmq.publishMenuItemUpdate({
      type: 'PRICE_CHANGE',
      menuItemId: menuItem.id,
      restaurantId: menuItem.restaurantId,
      data: menuItem,
      timestamp: new Date(),
    });
    return menuItem;
  }

  // Additional features
  async getMenuByRestaurant(restaurantId: string) {
    const cachedMenu = await this.redis.getMenu(restaurantId);
    if (cachedMenu) {
      return cachedMenu;
    }

    const menu = await this.prisma.menuCategory.findMany({
      where: { restaurantId },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { sequence: 'asc' },
        },
      },
      orderBy: { sequence: 'asc' },
    });

    await this.redis.setMenu(restaurantId, menu);
    return menu;
  }

  async updateMenuSequence(restaurantId: string, categorySequence: { id: string; sequence: number }[]) {
    const updates = categorySequence.map(({ id, sequence }) =>
      this.prisma.menuCategory.update({
        where: { id },
        data: { sequence },
      })
    );

    const updatedCategories = await this.prisma.$transaction(updates);
    await this.redis.invalidateMenu(restaurantId);
    
    await this.rabbitmq.publishMenuUpdate({
      type: 'UPDATE',
      data: updatedCategories,
      timestamp: new Date(),
    });

    return updatedCategories;
  }

  async updateMenuItemSequence(
    categoryId: string,
    itemSequence: { id: string; sequence: number }[]
  ) {
    const updates = itemSequence.map(({ id, sequence }) =>
      this.prisma.menuItem.update({
        where: { id },
        data: { sequence },
      })
    );

    const updatedItems = await this.prisma.$transaction(updates);
    const category = await this.prisma.menuCategory.findUnique({
      where: { id: categoryId },
    });

    if (category) {
      await this.redis.invalidateMenu(category.restaurantId);
    }

    await this.rabbitmq.publishMenuItemUpdate({
      type: 'PRICE_CHANGE',
      menuItemId: updatedItems[0]?.id,
      restaurantId: category?.restaurantId,
      data: updatedItems,
      timestamp: new Date(),
    });

    return updatedItems;
  }
} 