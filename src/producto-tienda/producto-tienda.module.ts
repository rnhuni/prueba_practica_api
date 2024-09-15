import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { ProductoTiendaService } from './producto-tienda.service';
import { ProductoTiendaController } from './producto-tienda.controller';
import { ProductoModule } from '../producto/producto.module';
import { TiendaModule } from '../tienda/tienda.module';

@Module({
  providers: [ProductoTiendaService],
  imports: [
    ProductoModule,
    TiendaModule,
    TypeOrmModule.forFeature([ProductoEntity, TiendaEntity]),
  ],
  controllers: [ProductoTiendaController],
})
export class ProductoTiendaModule {}
