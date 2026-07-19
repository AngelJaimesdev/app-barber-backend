import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barber } from './entities/barber.entity';
import { CreateBarberDto } from './dto/create-barber.dto';

@Injectable()
export class BarbersService {
  constructor(@InjectRepository(Barber) private repo: Repository<Barber>) {}

  findMe(userId: string) {
    return this.repo.findOne({
      where: { userId },
      relations: ['user', 'barbershop', 'barbershop.services'],
    });
  }

  async create(dto: CreateBarberDto) {
    const exists = await this.repo.findOne({ where: { userId: dto.userId } });
    if (exists) throw new ConflictException('Este usuario ya tiene perfil de barbero');
    const barber = this.repo.create(dto);
    return this.repo.save(barber);
  }

  findAll(barbershopId?: string) {
    const where = barbershopId ? { barbershopId, isActive: true } : { isActive: true };
    return this.repo.find({ where, relations: ['user', 'barbershop'] });
  }

  async findOne(id: string) {
    const barber = await this.repo.findOne({
      where: { id },
      relations: ['user', 'barbershop'],
    });
    if (!barber) throw new NotFoundException('Barbero no encontrado');
    return barber;
  }

  async update(id: string, dto: Partial<CreateBarberDto>) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.update(id, { isActive: false });
    return { message: 'Barbero desactivado' };
  }
}
