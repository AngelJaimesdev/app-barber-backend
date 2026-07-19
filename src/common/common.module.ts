import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barbershop } from '../barbershops/entities/barbershop.entity';
import { Barber } from '../barbers/entities/barber.entity';
import { BarbershopAccessService } from './services/barbershop-access.service';

@Module({
  imports: [TypeOrmModule.forFeature([Barbershop, Barber])],
  providers: [BarbershopAccessService],
  exports: [BarbershopAccessService],
})
export class CommonModule {}
