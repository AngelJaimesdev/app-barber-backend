import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { Service } from '../services/entities/service.entity';
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

const ACTIVE_STATUSES = [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED];

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private repo: Repository<Appointment>,
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
  ) {}

  /** Solo el cliente dueño, el barbero asignado, el owner de la barbería o un admin pueden ver/gestionar la cita. */
  private assertCanAccess(appointment: Appointment, user: User) {
    if (user.role === Role.SUPER_ADMIN) return;
    if (user.role === Role.CLIENT && appointment.clientId === user.id) return;
    if (user.role === Role.BARBER && appointment.barber?.userId === user.id) return;
    if (user.role === Role.OWNER && appointment.barbershop?.ownerId === user.id) return;
    throw new ForbiddenException('No tienes permiso sobre esta cita');
  }

  private async assertNoConflict(barberId: string, date: Date, durationMins: number, excludeId?: string) {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const sameDay = await this.repo.find({
      where: { barberId, date: Between(dayStart, dayEnd), status: In(ACTIVE_STATUSES) },
      relations: ['service'],
    });

    const newStart = date.getTime();
    const newEnd = newStart + durationMins * 60000;

    const conflict = sameDay.some((a) => {
      if (excludeId && a.id === excludeId) return false;
      const existingStart = a.date.getTime();
      const existingEnd = existingStart + (a.service?.durationMins ?? 0) * 60000;
      return existingStart < newEnd && newStart < existingEnd;
    });

    if (conflict) throw new BadRequestException('El barbero ya tiene una cita en ese horario');
  }

  async create(dto: CreateAppointmentDto, clientId: string) {
    const service = await this.serviceRepo.findOne({ where: { id: dto.serviceId } });
    if (!service) throw new NotFoundException('Servicio no encontrado');

    const date = new Date(dto.date);
    await this.assertNoConflict(dto.barberId, date, service.durationMins);

    const saved = await this.repo.save(
      this.repo.create({ ...dto, clientId, date }),
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
    if (user.role === Role.OWNER) {
      return this.repo.find({
        where: { barbershop: { ownerId: user.id } },
        relations: FULL_RELATIONS,
        order: { date: 'DESC' },
      });
    }
    return this.repo.find({
      relations: FULL_RELATIONS,
      order: { date: 'DESC' },
    });
  }

  private async getOrThrow(id: string) {
    const appointment = await this.repo.findOne({
      where: { id },
      relations: FULL_RELATIONS,
    });
    if (!appointment) throw new NotFoundException('Cita no encontrada');
    return appointment;
  }

  async findOne(id: string, user: User) {
    const appointment = await this.getOrThrow(id);
    this.assertCanAccess(appointment, user);
    return appointment;
  }

  async updateStatus(id: string, dto: UpdateAppointmentStatusDto, user: User) {
    const appointment = await this.getOrThrow(id);
    this.assertCanAccess(appointment, user);
    await this.repo.update(id, { status: dto.status });
    return this.getOrThrow(id);
  }

  async reschedule(id: string, date: string, user: User) {
    const appointment = await this.getOrThrow(id);
    this.assertCanAccess(appointment, user);
    if (['COMPLETED', 'CANCELLED'].includes(appointment.status)) {
      throw new BadRequestException('No se puede reprogramar esta cita');
    }
    const newDate = new Date(date);
    await this.assertNoConflict(appointment.barberId, newDate, appointment.service?.durationMins ?? 0, appointment.id);
    await this.repo.update(id, { date: newDate, status: AppointmentStatus.PENDING });
    return this.getOrThrow(id);
  }

  async cancel(id: string, user: User) {
    const appointment = await this.getOrThrow(id);
    this.assertCanAccess(appointment, user);
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('No se puede cancelar una cita completada');
    }
    await this.repo.update(id, { status: AppointmentStatus.CANCELLED });
    return { message: 'Cita cancelada' };
  }
}
