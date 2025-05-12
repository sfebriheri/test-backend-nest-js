import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    description: 'New status of the order',
    example: OrderStatus.CONFIRMED,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({
    required: false,
    description: 'Additional notes about the status update',
    example: 'Order confirmed and will be prepared shortly',
  })
  @IsString()
  @IsOptional()
  notes?: string;
} 