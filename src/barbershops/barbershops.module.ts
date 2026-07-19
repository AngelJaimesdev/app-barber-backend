import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarbershopsService } from './barbershops.service';
import { BarbershopsController } from './barbershops.controller';
import { Barbershop } from './entities/barbershop.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barbershop, Appointment])],
  controllers: [BarbershopsController],
  providers: [BarbershopsService],
  exports: [BarbershopsService],
})
export class BarbershopsModule {}
