import { Injectable } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { ProductoService } from '../producto/producto.service';
import { TiendaService } from '../tienda/tienda.service';

@Injectable()
export class ProductoTiendaService {
  constructor(
    private readonly productoService: ProductoService,
    private readonly tiendaService: TiendaService,
  ) {}

  async addStoreToProduct(productoId: string, tiendaId: string): Promise<void> {
    const producto = await this.productoService.findOne(productoId);
    const tienda = await this.tiendaService.findOne(tiendaId);

    if (producto.tiendas.find((t) => t.id === tienda.id)) {
      throw new BusinessLogicException(
        'La tienda ya está asociada',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    producto.tiendas.push(tienda);
    await this.productoService.update(productoId, producto);
  }

  async findStoresFromProduct(productoId: string) {
    const producto = await this.productoService.findOne(productoId);
    return producto.tiendas;
  }

  async findStoreFromProduct(productoId: string, tiendaId: string) {
    const producto = await this.productoService.findOne(productoId);
    const tienda = producto.tiendas.find((t) => t.id === tiendaId);
    if (!tienda) {
      throw new BusinessLogicException(
        'La tienda no está asociada al producto',
        BusinessError.NOT_FOUND,
      );
    }
    return tienda;
  }

  async updateStoresFromProduct(productoId: string, tiendaIds: string[]) {
    const producto = await this.productoService.findOne(productoId);
    const tiendas = await Promise.all(
      tiendaIds.map((id) => this.tiendaService.findOne(id)),
    );
    producto.tiendas = tiendas;
    await this.productoService.update(productoId, producto);
    return producto.tiendas;
  }

  async deleteStoreFromProduct(
    productoId: string,
    tiendaId: string,
  ): Promise<void> {
    const producto = await this.productoService.findOne(productoId);
    const tiendaIndex = producto.tiendas.findIndex((t) => t.id === tiendaId);
    if (tiendaIndex === -1) {
      throw new BusinessLogicException(
        'La tienda no está asociada al producto',
        BusinessError.NOT_FOUND,
      );
    }
    producto.tiendas.splice(tiendaIndex, 1);
    await this.productoService.update(productoId, producto);
  }
}
