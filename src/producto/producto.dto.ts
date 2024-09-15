import { IsNotEmpty, IsEnum, IsNumber, IsString, Min } from 'class-validator';

export class ProductoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'El precio debe ser un valor positivo' })
  precio: number;

  @IsNotEmpty()
  @IsEnum(['Perecedero', 'No perecedero'], {
    message: 'El tipo debe ser Perecedero o No perecedero',
  })
  tipo: string;
}
