import { IsString, IsNumber, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isVegetarian?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isVegan?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isSpicy?: boolean;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  calories?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  sequence?: number;

  @ApiProperty()
  @IsString()
  categoryId: string;
} 