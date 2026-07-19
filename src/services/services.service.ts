import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { BarbershopAccessService } from '../common/services/barbershop-access.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private repo: Repository<Service>,
    private access: BarbershopAccessService,
  ) {}

  async create(dto: CreateServiceDto, user: User) {
    await this.access.assertCanManage(dto.barbershopId, user);
    const service = this.repo.create(dto);
    return this.repo.save(service);
  }

  findAll(barbershopId?: string) {
    const where = barbershopId ? { barbershopId, isActive: true } : { isActive: true };
    return this.repo.find({ where, relations: ['barbershop'] });
  }

  async findOne(id: string) {
    const service = await this.repo.findOne({ where: { id }, relations: ['barbershop'] });
    if (!service) throw new NotFoundException('Servicio no encontrado');
    return service;
  }

  async update(id: string, dto: Partial<CreateServiceDto>, user: User) {
    const service = await this.findOne(id);
    await this.access.assertCanManage(service.barbershopId, user);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string, user: User) {
    const service = await this.findOne(id);
    await this.access.assertCanManage(service.barbershopId, user);
    await this.repo.update(id, { isActive: false });
    return { message: 'Servicio desactivado' };
  }
}
