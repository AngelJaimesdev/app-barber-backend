import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar citas (filtradas según rol del usuario)' })
  findAll(@CurrentUser() user: User) {
    return this.appointmentsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cita por ID' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @Roles(Role.CLIENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Crear cita (solo clientes)' })
  create(@Body() dto: CreateAppointmentDto, @CurrentUser() user: User) {
    return this.appointmentsService.create(dto, user.id);
  }

  @Patch(':id/status')
  @Roles(Role.SUPER_ADMIN, Role.OWNER, Role.BARBER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Actualizar estado de cita (barbero/owner/admin)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAppointmentStatusDto) {
    return this.appointmentsService.updateStatus(id, dto);
  }

  @Patch(':id/reschedule')
  @ApiOperation({ summary: 'Reprogramar cita (cambia solo la fecha/hora)' })
  reschedule(
    @Param('id') id: string,
    @Body('date') date: string,
    @CurrentUser() user: User,
  ) {
    return this.appointmentsService.reschedule(id, date, user);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar cita' })
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.appointmentsService.cancel(id, user);
  }
}
