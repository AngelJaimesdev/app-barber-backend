import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';

@Injectable()
export class InventoryService {
  constructor(@InjectRepository(InventoryItem) private repo: Repository<InventoryItem>) {}

  create(dto: CreateInventoryItemDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll(barbershopId: string) {
    return this.repo.find({ where: { barbershopId, isActive: true }, order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Ítem no encontrado');
    return item;
  }

  async update(id: string, dto: Partial<CreateInventoryItemDto>) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.update(id, { isActive: false });
    return { message: 'Ítem eliminado' };
  }

  async getLowStock(barbershopId: string) {
    return this.repo
      .createQueryBuilder('i')
      .where('i.barbershopId = :barbershopId', { barbershopId })
      .andWhere('i.quantity <= i.minQuantity')
      .andWhere('i.isActive = true')
      .getMany();
  }
}
