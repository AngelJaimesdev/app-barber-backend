import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarbersService } from './barbers.service';
import { BarbersController } from './barbers.controller';
import { Barber } from './entities/barber.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Barber]), CommonModule],
  controllers: [BarbersController],
  providers: [BarbersService],
  exports: [BarbersService],
})
export class BarbersModule {}
