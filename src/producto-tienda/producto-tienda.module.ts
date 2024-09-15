import { Module } from '@nestjs/common';
import { ProductoTiendaService } from './producto-tienda.service';
import { ProductoTiendaController } from './producto-tienda.controller';

@Module({
  providers: [ProductoTiendaService],
  controllers: [ProductoTiendaController],
})
export class ProductoTiendaModule {}
