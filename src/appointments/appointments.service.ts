import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

const FULL_RELATIONS = [
  'client',
  'barber',
  'barber.user',       // ← carga el usuario del barbero
  'service',
  'barbershop',
];

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private repo: Repository<Appointment>,
  ) {}

  async create(dto: CreateAppointmentDto, clientId: string) {
    const conflict = await this.repo.findOne({
      where: {
        barberId: dto.barberId,
        date: new Date(dto.date),
        status: AppointmentStatus.CONFIRMED,
      },
    });
    if (conflict) throw new BadRequestException('El barbero ya tiene una cita en ese horario');

    const saved = await this.repo.save(
      this.repo.create({ ...dto, clientId, date: new Date(dto.date) }),
    );
    return this.repo.findOne({ where: { id: saved.id }, relations: FULL_RELATIONS });
  }

  findAll(user: User) {
    if (user.role === Role.CLIENT) {
      return this.repo.find({
        where: { clientId: user.id },
        relations: FULL_RELATIONS,
        order: { date: 'DESC' },
      });
    }
    if (user.role === Role.BARBER) {
      return this.repo.find({
        where: { barber: { userId: user.id } },
        relations: FULL_RELATIONS,
        order: { date: 'DESC' },
      });
    }
    return this.repo.find({
      relations: FULL_RELATIONS,
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.repo.findOne({
      where: { id },
      relations: FULL_RELATIONS,
    });
    if (!appointment) throw new NotFoundException('Cita no encontrada');
    return appointment;
  }

  async updateStatus(id: string, dto: UpdateAppointmentStatusDto) {
    await this.repo.update(id, { status: dto.status });
    return this.findOne(id);
  }

  async reschedule(id: string, date: string, user: User) {
    const appointment = await this.findOne(id);
    if (user.role === Role.CLIENT && appointment.clientId !== user.id) {
      throw new NotFoundException('Cita no encontrada');
    }
    if (['COMPLETED', 'CANCELLED'].includes(appointment.status)) {
      throw new BadRequestException('No se puede reprogramar esta cita');
    }
    await this.repo.update(id, { date: new Date(date), status: AppointmentStatus.PENDING });
    return this.findOne(id);
  }

  async cancel(id: string, user: User) {
    const appointment = await this.findOne(id);
    if (user.role === Role.CLIENT && appointment.clientId !== user.id) {
      throw new NotFoundException('Cita no encontrada');
    }
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('No se puede cancelar una cita completada');
    }
    await this.repo.update(id, { status: AppointmentStatus.CANCELLED });
    return { message: 'Cita cancelada' };
  }
}
