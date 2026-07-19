import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar servicios (opcional: filtrar por barbería)' })
  @ApiQuery({ name: 'barbershopId', required: false })
  findAll(@Query('barbershopId') barbershopId?: string) {
    return this.servicesService.findAll(barbershopId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener servicio por ID' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER, Role.BARBER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear servicio' })
  create(@Body() dto: CreateServiceDto, @CurrentUser() user: User) {
    return this.servicesService.create(dto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER, Role.BARBER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar servicio' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateServiceDto>, @CurrentUser() user: User) {
    return this.servicesService.update(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER, Role.BARBER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desactivar servicio' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.servicesService.remove(id, user);
  }
}
