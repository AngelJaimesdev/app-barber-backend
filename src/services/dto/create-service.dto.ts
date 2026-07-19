import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateServiceDto {
  @ApiProperty({ example: 'Corte de cabello clásico' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 25000 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 30, description: 'Duración en minutos' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  durationMins: number;

  @ApiProperty({ description: 'ID de la barbería' })
  @IsUUID()
  @IsNotEmpty()
  barbershopId: string;
}
