import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Roles permitidos en registro público (SUPER_ADMIN solo por seed/admin)
export enum PublicRole {
  CLIENT = 'CLIENT',
  BARBER = 'BARBER',
  OWNER  = 'OWNER',
}

export class RegisterDto {
  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: '+573001234567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ enum: PublicRole, default: PublicRole.CLIENT })
  @IsEnum(PublicRole, { message: 'Rol inválido. Opciones: CLIENT, BARBER, OWNER' })
  role: PublicRole;
}
