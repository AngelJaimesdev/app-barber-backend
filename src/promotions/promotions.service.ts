import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { BarbershopAccessService } from '../common/services/barbershop-access.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion) private repo: Repository<Promotion>,
    private access: BarbershopAccessService,
  ) {}

  async create(dto: CreatePromotionDto, user: User) {
    await this.access.assertCanManage(dto.barbershopId, user);
    return this.repo.save(this.repo.create(dto));
  }

  findAll(barbershopId: string) {
    return this.repo.find({ where: { barbershopId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Promoción no encontrada');
    return p;
  }

  async update(id: string, dto: Partial<CreatePromotionDto>, user: User) {
    const p = await this.findOne(id);
    await this.access.assertCanManage(p.barbershopId, user);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string, user: User) {
    const p = await this.findOne(id);
    await this.access.assertCanManage(p.barbershopId, user);
    await this.repo.update(id, { isActive: false });
    return { message: 'Promoción desactivada' };
  }
}
