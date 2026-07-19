import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePromotionDto {
  @ApiProperty() @IsUUID() barbershopId: string;
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiProperty({ minimum: 1, maximum: 100 }) @Type(() => Number) @IsNumber() @Min(1) @Max(100) discountPercent: number;
  @ApiProperty() @IsDateString() validFrom: string;
  @ApiProperty() @IsDateString() validTo: string;
}
