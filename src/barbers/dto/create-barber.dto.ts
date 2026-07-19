import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBarberDto {
  @ApiProperty({ description: 'ID del usuario que será barbero' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'ID de la barbería' })
  @IsUUID()
  @IsNotEmpty()
  barbershopId: string;

  @ApiPropertyOptional({ example: 'Cortes clásicos y fade' })
  @IsString()
  @IsOptional()
  specialty?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
