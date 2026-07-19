import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'ID del barbero' })
  @IsUUID()
  @IsNotEmpty()
  barberId: string;

  @ApiProperty({ description: 'ID del servicio' })
  @IsUUID()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ description: 'ID de la barbería' })
  @IsUUID()
  @IsNotEmpty()
  barbershopId: string;

  @ApiProperty({ example: '2024-12-15T10:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Prefiero corte sin gel' })
  @IsString()
  @IsOptional()
  notes?: string;
}
