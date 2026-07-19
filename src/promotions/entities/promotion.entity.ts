import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Barbershop } from '../../barbershops/entities/barbershop.entity';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() barbershopId: string;
  @Column() title: string;
  @Column({ nullable: true }) description: string;
  @Column({ type: 'decimal', precision: 5, scale: 2 }) discountPercent: number;
  @Column({ type: 'timestamp' }) validFrom: Date;
  @Column({ type: 'timestamp' }) validTo: Date;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  @ManyToOne(() => Barbershop) @JoinColumn({ name: 'barbershopId' }) barbershop: Barbershop;
}
