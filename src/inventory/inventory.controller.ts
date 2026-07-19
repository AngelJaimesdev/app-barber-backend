import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.OWNER)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() dto: CreateInventoryItemDto) { return this.inventoryService.create(dto); }

  @Get()
  findAll(@Query('barbershopId') barbershopId: string) { return this.inventoryService.findAll(barbershopId); }

  @Get('low-stock')
  getLowStock(@Query('barbershopId') barbershopId: string) { return this.inventoryService.getLowStock(barbershopId); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.inventoryService.findOne(id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateInventoryItemDto>) { return this.inventoryService.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.inventoryService.remove(id); }
}
