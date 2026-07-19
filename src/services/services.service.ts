import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(@InjectRepository(Service) private repo: Repository<Service>) {}

  create(dto: CreateServiceDto) {
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

  async update(id: string, dto: Partial<CreateServiceDto>) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.update(id, { isActive: false });
    return { message: 'Servicio desactivado' };
  }
}
