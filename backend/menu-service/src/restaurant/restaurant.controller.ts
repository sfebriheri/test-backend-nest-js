import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Restaurant created successfully' })
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiResponse({ status: 200, description: 'Return all restaurants' })
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a restaurant by id' })
  @ApiResponse({ status: 200, description: 'Return the restaurant' })
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiResponse({ status: 200, description: 'Restaurant updated successfully' })
  update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a restaurant' })
  @ApiResponse({ status: 200, description: 'Restaurant deleted successfully' })
  remove(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }
} 