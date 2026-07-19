import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BarbershopsService } from './barbershops.service';
import { CreateBarbershopDto } from './dto/create-barbershop.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@ApiTags('Barbershops')
@Controller('barbershops')
export class BarbershopsController {
  constructor(private readonly barbershopsService: BarbershopsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las barberías activas' })
  findAll() {
    return this.barbershopsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener barbería por ID' })
  findOne(@Param('id') id: string) {
    return this.barbershopsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear barbería (Owner o SuperAdmin)' })
  create(@Body() dto: CreateBarbershopDto, @CurrentUser() user: User) {
    return this.barbershopsService.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar barbería' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateBarbershopDto>, @CurrentUser() user: User) {
    return this.barbershopsService.update(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desactivar barbería' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.barbershopsService.remove(id, user);
  }

  @Get(':id/reports')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reportes de la barbería (citas, ingresos, top servicios)' })
  getReports(@Param('id') id: string, @CurrentUser() user: User) {
    return this.barbershopsService.getReports(id, user);
  }
}
