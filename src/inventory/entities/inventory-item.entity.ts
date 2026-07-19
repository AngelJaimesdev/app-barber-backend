import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Barbershop } from '../../barbershops/entities/barbershop.entity';

export enum InventoryCategory {
  TOOL      = 'TOOL',
  PRODUCT   = 'PRODUCT',
  EQUIPMENT = 'EQUIPMENT',
  OTHER     = 'OTHER',
}

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() barbershopId: string;
  @Column() name: string;
  @Column({ type: 'enum', enum: InventoryCategory, default: InventoryCategory.PRODUCT }) category: InventoryCategory;
  @Column({ type: 'int', default: 0 }) quantity: number;
  @Column({ type: 'int', default: 0 }) minQuantity: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) unitPrice: number;
  @Column({ nullable: true }) notes: string;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  @ManyToOne(() => Barbershop) @JoinColumn({ name: 'barbershopId' }) barbershop: Barbershop;

  get isLowStock(): boolean { return this.quantity <= this.minQuantity; }
}
