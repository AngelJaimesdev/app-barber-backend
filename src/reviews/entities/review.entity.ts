import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Barber } from '../../barbers/entities/barber.entity';
import { Barbershop } from '../../barbershops/entities/barbershop.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() clientId: string;
  @Column({ nullable: true }) barberId: string;
  @Column({ nullable: true }) barbershopId: string;
  @Column({ nullable: true }) appointmentId: string;
  @Column({ type: 'int' }) rating: number;
  @Column({ nullable: true }) comment: string;
  @CreateDateColumn() createdAt: Date;

  @ManyToOne(() => User) @JoinColumn({ name: 'clientId' }) client: User;
  @ManyToOne(() => Barber, { nullable: true }) @JoinColumn({ name: 'barberId' }) barber: Barber;
  @ManyToOne(() => Barbershop, { nullable: true }) @JoinColumn({ name: 'barbershopId' }) barbershop: Barbershop;
  @ManyToOne(() => Appointment, { nullable: true }) @JoinColumn({ name: 'appointmentId' }) appointment: Appointment;
}
