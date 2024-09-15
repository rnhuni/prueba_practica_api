import { Module } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { TiendaController } from './tienda.controller';

@Module({
  providers: [TiendaService],
  controllers: [TiendaController],
})
export class TiendaModule {}
