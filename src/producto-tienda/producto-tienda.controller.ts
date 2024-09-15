import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { ProductoTiendaService } from './producto-tienda.service';
import { ProductoTiendaDto } from './producto-tienda.dto';

@Controller()
export class ProductoTiendaController {
  constructor(private readonly productoTiendaService: ProductoTiendaService) {}

  @Post('add')
  async addStoreToProduct(
    @Body() productoTiendaDto: ProductoTiendaDto,
  ): Promise<void> {
    const { productoId, tiendaId } = productoTiendaDto;
    return this.productoTiendaService.addStoreToProduct(productoId, tiendaId);
  }

  @Get('product/:id/stores')
  async findStoresFromProduct(@Param('id') id: string) {
    return this.productoTiendaService.findStoresFromProduct(id);
  }

  @Get('product/:productoId/stores/:tiendaId')
  async findStoreFromProduct(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return this.productoTiendaService.findStoreFromProduct(
      productoId,
      tiendaId,
    );
  }

  @Put('product/:id/stores')
  async updateStoresFromProduct(
    @Param('id') id: string,
    @Body('tiendaIds') tiendaIds: string[],
  ) {
    return this.productoTiendaService.updateStoresFromProduct(id, tiendaIds);
  }

  @Delete('product/:productoId/stores/:tiendaId')
  async deleteStoreFromProduct(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ): Promise<void> {
    return this.productoTiendaService.deleteStoreFromProduct(
      productoId,
      tiendaId,
    );
  }
}
