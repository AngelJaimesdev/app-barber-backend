import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Barber } from '../../barbers/entities/barber.entity';
import { Service } from '../../services/entities/service.entity';
import { Barbershop } from '../../barbershops/entities/barbershop.entity';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientId: string;

  @Column()
  barberId: string;

  @Column()
  serviceId: string;

  @Column()
  barbershopId: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @ManyToOne(() => Barber, (barber) => barber.appointments)
  @JoinColumn({ name: 'barberId' })
  barber: Barber;

  @ManyToOne(() => Service, (service) => service.appointments)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @ManyToOne(() => Barbershop, (barbershop) => barbershop.appointments)
  @JoinColumn({ name: 'barbershopId' })
  barbershop: Barbershop;
}
