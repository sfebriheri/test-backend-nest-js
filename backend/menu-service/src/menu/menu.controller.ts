import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Category endpoints
  @Post('restaurants/:restaurantId/categories')
  @ApiOperation({ summary: 'Create a new menu category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  createCategory(
    @Param('restaurantId') restaurantId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.menuService.createCategory(restaurantId, createCategoryDto);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update a menu category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.menuService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete a menu category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  removeCategory(@Param('id') id: string) {
    return this.menuService.removeCategory(id);
  }

  // Menu item endpoints
  @Post('restaurants/:restaurantId/items')
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({ status: 201, description: 'Menu item created successfully' })
  createMenuItem(
    @Param('restaurantId') restaurantId: string,
    @Body() createMenuItemDto: CreateMenuItemDto,
  ) {
    return this.menuService.createMenuItem(restaurantId, createMenuItemDto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update a menu item' })
  @ApiResponse({ status: 200, description: 'Menu item updated successfully' })
  updateMenuItem(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuService.updateMenuItem(id, updateMenuItemDto);
  }

  @Patch('items/:id/availability')
  @ApiOperation({ summary: 'Update menu item availability' })
  @ApiResponse({ status: 200, description: 'Menu item availability updated successfully' })
  updateMenuItemAvailability(
    @Param('id') id: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.menuService.updateMenuItemAvailability(id, isAvailable);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete a menu item' })
  @ApiResponse({ status: 200, description: 'Menu item deleted successfully' })
  removeMenuItem(@Param('id') id: string) {
    return this.menuService.removeMenuItem(id);
  }
} 