import { IsNotEmpty, IsString, Length } from 'class-validator';

export class TiendaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 3, {
    message: 'El valor de ciudad debe ser un código de tres caracteres.',
  })
  ciudad: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;
}
