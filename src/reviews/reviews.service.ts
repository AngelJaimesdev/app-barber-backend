import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(Review) private repo: Repository<Review>) {}

  create(dto: CreateReviewDto, clientId: string) {
    return this.repo.save(this.repo.create({ ...dto, clientId }));
  }

  findByBarbershop(barbershopId: string) {
    return this.repo.find({
      where: { barbershopId },
      relations: ['client', 'barber'],
      order: { createdAt: 'DESC' },
    });
  }

  findByBarber(barberId: string) {
    return this.repo.find({
      where: { barberId },
      relations: ['client'],
      order: { createdAt: 'DESC' },
    });
  }

  findByClient(clientId: string) {
    return this.repo.find({
      where: { clientId },
      relations: ['barber', 'barber.user', 'barbershop', 'appointment', 'appointment.service'],
      order: { createdAt: 'DESC' },
    });
  }

  async avgRating(barbershopId: string) {
    const result = await this.repo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(r.id)', 'total')
      .where('r.barbershopId = :barbershopId', { barbershopId })
      .getRawOne();
    return { avg: parseFloat(result.avg) || 0, total: parseInt(result.total) || 0 };
  }
}
