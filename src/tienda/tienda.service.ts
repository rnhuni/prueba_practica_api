import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';
import { TiendaDto } from './tienda.dto';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  async findAll(): Promise<TiendaEntity[]> {
    return this.tiendaRepository.find();
  }

  async findOne(id: string): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });

    if (!tienda)
      throw new BusinessLogicException(
        'No se encontró la tienda con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );

    return tienda;
  }

  async create(tiendaDto: TiendaDto): Promise<TiendaEntity> {
    const tienda = this.tiendaRepository.create(tiendaDto);
    return this.tiendaRepository.save(tienda);
  }

  async update(
    id: string,
    updateTiendaDto: Partial<TiendaDto>,
  ): Promise<TiendaEntity> {
    const existingTienda = await this.tiendaRepository.findOne({
      where: { id },
    });

    if (!existingTienda)
      throw new BusinessLogicException(
        'No se encontró la tienda con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );

    await this.tiendaRepository.update(id, updateTiendaDto);

    const updatedTienda = await this.tiendaRepository.findOne({
      where: { id },
    });
    return updatedTienda;
  }

  async delete(id: string) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });

    if (!tienda)
      throw new BusinessLogicException(
        'No se encontró la tienda con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );

    await this.tiendaRepository.remove(tienda);
  }
}
