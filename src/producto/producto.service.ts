import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { ProductoDto } from './producto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    return this.productoRepository.find({ relations: ['tiendas'] });
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['tiendas'],
    });

    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return producto;
  }

  async create(productoDto: ProductoDto): Promise<ProductoEntity> {
    const producto = this.productoRepository.create(productoDto);
    return this.productoRepository.save(producto);
  }

  async update(
    id: string,
    updateProductoDto: Partial<ProductoDto>,
  ): Promise<ProductoEntity> {
    const existingProducto = await this.productoRepository.findOne({
      where: { id },
    });

    if (!existingProducto)
      throw new BusinessLogicException(
        'El producto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    await this.productoRepository.update(id, updateProductoDto);

    const updatedProducto = await this.productoRepository.findOne({
      where: { id },
    });
    return updatedProducto;
  }

  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });

    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    await this.productoRepository.remove(producto);
  }
}
