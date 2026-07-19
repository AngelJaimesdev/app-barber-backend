import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiPropertyOptional() @IsUUID() @IsOptional() barberId?: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() barbershopId?: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() appointmentId?: string;
  @ApiProperty({ minimum: 1, maximum: 5 }) @IsInt() @Min(1) @Max(5) rating: number;
  @ApiPropertyOptional() @IsString() @IsOptional() comment?: string;
}
