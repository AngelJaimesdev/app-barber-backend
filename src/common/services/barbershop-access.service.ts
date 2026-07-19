import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barbershop } from '../../barbershops/entities/barbershop.entity';
import { Barber } from '../../barbers/entities/barber.entity';
import { Role } from '../enums/role.enum';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class BarbershopAccessService {
  constructor(
    @InjectRepository(Barbershop) private shopRepo: Repository<Barbershop>,
    @InjectRepository(Barber) private barberRepo: Repository<Barber>,
  ) {}

  /** Lanza ForbiddenException si el usuario no gestiona esta barbería (dueño, barbero asignado o admin). */
  async assertCanManage(barbershopId: string, user: User) {
    if (user.role === Role.SUPER_ADMIN) return;

    if (user.role === Role.OWNER) {
      const shop = await this.shopRepo.findOne({ where: { id: barbershopId } });
      if (shop && shop.ownerId === user.id) return;
    }

    if (user.role === Role.BARBER) {
      const barber = await this.barberRepo.findOne({ where: { userId: user.id, barbershopId } });
      if (barber) return;
    }

    throw new ForbiddenException('No tienes permiso sobre esta barbería');
  }
}
