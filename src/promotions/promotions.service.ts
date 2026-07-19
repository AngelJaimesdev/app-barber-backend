import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(@InjectRepository(Promotion) private repo: Repository<Promotion>) {}

  create(dto: CreatePromotionDto) {
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

  async update(id: string, dto: Partial<CreatePromotionDto>) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.update(id, { isActive: false });
    return { message: 'Promoción desactivada' };
  }
}
