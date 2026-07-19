import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BarbersService } from './barbers.service';
import { CreateBarberDto } from './dto/create-barber.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@ApiTags('Barbers')
@Controller('barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mi perfil de barbero' })
  getMe(@CurrentUser() user: User) {
    return this.barbersService.findMe(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar barberos (opcional: filtrar por barbería)' })
  @ApiQuery({ name: 'barbershopId', required: false })
  findAll(@Query('barbershopId') barbershopId?: string) {
    return this.barbersService.findAll(barbershopId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener barbero por ID' })
  findOne(@Param('id') id: string) {
    return this.barbersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar barbero a una barbería' })
  create(@Body() dto: CreateBarberDto) {
    return this.barbersService.create(dto);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar mi perfil de barbero' })
  async updateMe(@CurrentUser() user: User, @Body() dto: Partial<CreateBarberDto>) {
    const barber = await this.barbersService.findMe(user.id);
    if (!barber) throw new NotFoundException('Perfil de barbero no encontrado');
    return this.barbersService.update(barber.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER, Role.BARBER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar perfil de barbero' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateBarberDto>) {
    return this.barbersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desactivar barbero' })
  remove(@Param('id') id: string) {
    return this.barbersService.remove(id);
  }
}
