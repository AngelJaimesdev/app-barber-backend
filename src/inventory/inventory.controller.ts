import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.OWNER)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() dto: CreateInventoryItemDto, @CurrentUser() user: User) { return this.inventoryService.create(dto, user); }

  @Get()
  findAll(@Query('barbershopId') barbershopId: string, @CurrentUser() user: User) { return this.inventoryService.findAll(barbershopId, user); }

  @Get('low-stock')
  getLowStock(@Query('barbershopId') barbershopId: string, @CurrentUser() user: User) { return this.inventoryService.getLowStock(barbershopId, user); }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) { return this.inventoryService.findOne(id, user); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateInventoryItemDto>, @CurrentUser() user: User) { return this.inventoryService.update(id, dto, user); }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) { return this.inventoryService.remove(id, user); }
}
