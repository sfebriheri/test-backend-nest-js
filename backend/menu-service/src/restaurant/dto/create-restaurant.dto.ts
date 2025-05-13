import { IsString, IsEmail, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({ description: 'Restaurant name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Restaurant description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Restaurant address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Restaurant city' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Restaurant state' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'Restaurant zip code' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({ description: 'Restaurant phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Restaurant email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Restaurant website', required: false })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ description: 'Restaurant logo URL', required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ description: 'Restaurant active status', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 