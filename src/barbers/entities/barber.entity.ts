import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Barbershop } from '../../barbershops/entities/barbershop.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('barbers')
export class Barber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column()
  barbershopId: string;

  @Column({ nullable: true })
  specialty: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.barberProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Barbershop, (barbershop) => barbershop.barbers)
  @JoinColumn({ name: 'barbershopId' })
  barbershop: Barbershop;

  @OneToMany(() => Appointment, (appointment) => appointment.barber)
  appointments: Appointment[];
}
