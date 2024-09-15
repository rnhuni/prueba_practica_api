import { IsNotEmpty, IsEnum, IsNumber, IsString } from 'class-validator';

export class ProductoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsNumber()
  precio: number;

  @IsNotEmpty()
  @IsEnum(['Perecedero', 'No perecedero'], {
    message: 'El tipo debe ser Perecedero o No perecedero',
  })
  tipo: string;
}
