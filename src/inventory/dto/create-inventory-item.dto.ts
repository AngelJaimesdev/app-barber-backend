import { IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InventoryCategory } from '../entities/inventory-item.entity';

export class CreateInventoryItemDto {
  @ApiProperty() @IsUUID() barbershopId: string;
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional({ enum: InventoryCategory }) @IsEnum(InventoryCategory) @IsOptional() category?: InventoryCategory;
  @ApiPropertyOptional() @Type(() => Number) @IsInt() @Min(0) @IsOptional() quantity?: number;
  @ApiPropertyOptional() @Type(() => Number) @IsInt() @Min(0) @IsOptional() minQuantity?: number;
  @ApiPropertyOptional() @Type(() => Number) @IsNumber() @IsOptional() unitPrice?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
}
