import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBarbershopDto {
  @ApiProperty({ example: 'Barbería El Estilo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Calle 10 #5-20, Bogotá' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '+573001234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({
    example: {
      monday: { open: '08:00', close: '18:00' },
      saturday: { open: '09:00', close: '15:00' },
    },
  })
  @IsOptional()
  workingHours?: Record<string, any>;
}
