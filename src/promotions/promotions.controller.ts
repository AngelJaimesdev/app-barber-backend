import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  findAll(@Query('barbershopId') barbershopId: string) { return this.promotionsService.findAll(barbershopId); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.promotionsService.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER)
  @ApiBearerAuth()
  create(@Body() dto: CreatePromotionDto, @CurrentUser() user: User) { return this.promotionsService.create(dto, user); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: Partial<CreatePromotionDto>, @CurrentUser() user: User) { return this.promotionsService.update(id, dto, user); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @CurrentUser() user: User) { return this.promotionsService.remove(id, user); }
}
