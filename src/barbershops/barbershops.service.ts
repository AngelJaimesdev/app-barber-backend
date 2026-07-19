import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barbershop } from './entities/barbershop.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { CreateBarbershopDto } from './dto/create-barbershop.dto';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BarbershopsService {
  constructor(
    @InjectRepository(Barbershop) private repo: Repository<Barbershop>,
    @InjectRepository(Appointment) private apptRepo: Repository<Appointment>,
  ) {}

  create(dto: CreateBarbershopDto, ownerId: string) {
    const barbershop = this.repo.create({ ...dto, ownerId });
    return this.repo.save(barbershop);
  }

  findAll() {
    return this.repo.find({ where: { isActive: true }, relations: ['owner', 'barbers'] });
  }

  async findOne(id: string) {
    const barbershop = await this.repo.findOne({
      where: { id },
      relations: ['owner', 'barbers', 'barbers.user', 'services'],
    });
    if (!barbershop) throw new NotFoundException('Barbería no encontrada');
    return barbershop;
  }

  async update(id: string, dto: Partial<CreateBarbershopDto>, user: User) {
    const barbershop = await this.findOne(id);
    if (user.role !== Role.SUPER_ADMIN && barbershop.ownerId !== user.id) {
      throw new ForbiddenException('No tienes permiso para editar esta barbería');
    }
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string, user: User) {
    const barbershop = await this.findOne(id);
    if (user.role !== Role.SUPER_ADMIN && barbershop.ownerId !== user.id) {
      throw new ForbiddenException('No tienes permiso');
    }
    await this.repo.update(id, { isActive: false });
    return { message: 'Barbería desactivada' };
  }

  async getReports(barbershopId: string, user: User) {
    const barbershop = await this.findOne(barbershopId);
    if (user.role !== Role.SUPER_ADMIN && barbershop.ownerId !== user.id) {
      throw new ForbiddenException('No tienes permiso para ver los reportes de esta barbería');
    }

    const [total, completed, cancelled, pending, confirmed] = await Promise.all([
      this.apptRepo.count({ where: { barbershopId } }),
      this.apptRepo.count({ where: { barbershopId, status: 'COMPLETED' as any } }),
      this.apptRepo.count({ where: { barbershopId, status: 'CANCELLED' as any } }),
      this.apptRepo.count({ where: { barbershopId, status: 'PENDING' as any } }),
      this.apptRepo.count({ where: { barbershopId, status: 'CONFIRMED' as any } }),
    ]);

    const topServices = await this.apptRepo
      .createQueryBuilder('a')
      .select('a.serviceId', 'serviceId')
      .addSelect('COUNT(a.id)', 'count')
      .leftJoin('a.service', 's')
      .addSelect('s.name', 'name')
      .addSelect('s.price', 'price')
      .where('a.barbershopId = :barbershopId', { barbershopId })
      .groupBy('a.serviceId, s.name, s.price')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

    const revenue = await this.apptRepo
      .createQueryBuilder('a')
      .select('COALESCE(SUM(s.price), 0)', 'total')
      .leftJoin('a.service', 's')
      .where('a.barbershopId = :barbershopId', { barbershopId })
      .andWhere('a.status = :status', { status: 'COMPLETED' })
      .getRawOne();

    return { total, completed, cancelled, pending, confirmed, topServices, revenue: parseFloat(revenue?.total ?? '0') };
  }
}
