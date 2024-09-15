import { IsNotEmpty, IsNumber } from 'class-validator';

export class ProductoTiendaDto {
  @IsNotEmpty()
  @IsNumber()
  productoId: string;

  @IsNotEmpty()
  @IsNumber()
  tiendaId: string;
}
