import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ProductoTiendaService } from './producto-tienda.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller()
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
  constructor(private readonly productoTiendaService: ProductoTiendaService) {}

  @Post('products/:productoId/stores/:tiendaId')
  async addStoreToProduct(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return this.productoTiendaService.addStoreToProduct(productoId, tiendaId);
  }

  @Get('products/:id/stores')
  async findStoresFromProduct(@Param('id') id: string) {
    return this.productoTiendaService.findStoresFromProduct(id);
  }

  @Get('products/:productoId/stores/:tiendaId')
  async findStoreFromProduct(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return this.productoTiendaService.findStoreFromProduct(
      productoId,
      tiendaId,
    );
  }

  @Put('products/:id/stores')
  async updateStoresFromProduct(
    @Param('id') id: string,
    @Body('tiendaIds') tiendaIds: string[],
  ) {
    return this.productoTiendaService.updateStoresFromProduct(id, tiendaIds);
  }

  @Delete('products/:productoId/stores/:tiendaId')
  async deleteStoreFromProduct(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ): Promise<void> {
    return this.productoTiendaService.deleteStoreFromProduct(
      productoId,
      tiendaId,
    );
  }

  @Delete('products/:productoId/stores')
  async deleteStoresFromProduct(
    @Param('productoId') productoId: string,
  ): Promise<void> {
    return this.productoTiendaService.deleteStoresFromProduct(productoId);
  }
}
