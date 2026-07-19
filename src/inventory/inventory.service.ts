import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { BarbershopAccessService } from '../common/services/barbershop-access.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem) private repo: Repository<InventoryItem>,
    private access: BarbershopAccessService,
  ) {}

  async create(dto: CreateInventoryItemDto, user: User) {
    await this.access.assertCanManage(dto.barbershopId, user);
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(barbershopId: string, user: User) {
    await this.access.assertCanManage(barbershopId, user);
    return this.repo.find({ where: { barbershopId, isActive: true }, order: { name: 'ASC' } });
  }

  async findOne(id: string, user?: User) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Ítem no encontrado');
    if (user) await this.access.assertCanManage(item.barbershopId, user);
    return item;
  }

  async update(id: string, dto: Partial<CreateInventoryItemDto>, user: User) {
    const item = await this.findOne(id);
    await this.access.assertCanManage(item.barbershopId, user);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string, user: User) {
    const item = await this.findOne(id);
    await this.access.assertCanManage(item.barbershopId, user);
    await this.repo.update(id, { isActive: false });
    return { message: 'Ítem eliminado' };
  }

  async getLowStock(barbershopId: string, user: User) {
    await this.access.assertCanManage(barbershopId, user);
    return this.repo
      .createQueryBuilder('i')
      .where('i.barbershopId = :barbershopId', { barbershopId })
      .andWhere('i.quantity <= i.minQuantity')
      .andWhere('i.isActive = true')
      .getMany();
  }
}
