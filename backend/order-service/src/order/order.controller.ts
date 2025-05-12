import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Return all orders' })
  @ApiQuery({ name: 'restaurantId', required: false, description: 'Filter orders by restaurant ID' })
  findAll(@Query('restaurantId') restaurantId?: string) {
    return this.orderService.findAll(restaurantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by id' })
  @ApiResponse({ status: 200, description: 'Return the order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  cancelOrder(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.orderService.cancelOrder(id, reason);
  }

  @Get('restaurant/:restaurantId/status/:status')
  @ApiOperation({ summary: 'Get orders by status for a restaurant' })
  @ApiResponse({ status: 200, description: 'Return orders with the specified status' })
  @ApiResponse({ status: 400, description: 'Invalid status' })
  getOrdersByStatus(
    @Param('restaurantId') restaurantId: string,
    @Param('status') status: string,
  ) {
    return this.orderService.getOrdersByStatus(restaurantId, status as any);
  }

  @Get('restaurant/:restaurantId/date-range')
  @ApiOperation({ summary: 'Get orders by date range for a restaurant' })
  @ApiResponse({ status: 200, description: 'Return orders within the date range' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (ISO format)' })
  getOrdersByDateRange(
    @Param('restaurantId') restaurantId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.orderService.getOrdersByDateRange(
      restaurantId,
      new Date(startDate),
      new Date(endDate),
    );
  }
} 