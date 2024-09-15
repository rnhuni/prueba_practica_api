/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductoTiendaService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,
     
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ) {}

    async addStoreToProduct(productoId: string, tiendaId: string): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]}) 
        if (!producto)
          throw new BusinessLogicException("No se encontró el producto con el id indicado", BusinessError.NOT_FOUND);

        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}});
        if (!tienda)
          throw new BusinessLogicException("No se encontró la tienda con el id proporcionado", BusinessError.NOT_FOUND);
     
        const productoTienda: TiendaEntity = producto.tiendas.find(e => e.id === tienda.id);    
        if (!productoTienda)
          producto.tiendas = [...producto.tiendas, tienda];
        return await this.productoRepository.save(producto);
      }
     
    async findStoreFromProduct(productoId: string, tiendaId: string): Promise<TiendaEntity> {
      const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]}); 
      if (!producto)
        throw new BusinessLogicException("No se encontró el producto con el id indicado", BusinessError.NOT_FOUND)

      const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}});
      if (!tienda)
        throw new BusinessLogicException("No se encontró la tienda con el id proporcionado", BusinessError.NOT_FOUND)
        
      const productoTienda: TiendaEntity = producto.tiendas.find(e => e.id === tienda.id);    
      if (!productoTienda)
        throw new BusinessLogicException("La tienda no está asociada al producto", BusinessError.NOT_FOUND)
    
      return productoTienda;
    }
     
    async findStoresFromProduct(productoId: string): Promise<TiendaEntity[]> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
        if (!producto)
          throw new BusinessLogicException("No se encontró el producto con el id indicado", BusinessError.NOT_FOUND)
        
        return producto.tiendas;
    }
     
    async updateStoresFromProduct(productoId: string, tiendas: string[]): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
     
        if (!producto)
          throw new BusinessLogicException("No se encontró el producto con el id indicado", BusinessError.NOT_FOUND)
     
        producto.tiendas = []
        for (let i = 0; i < tiendas.length; i++) {
          const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendas[i]}});
          if (!tienda)
            throw new BusinessLogicException("No se encontró la tienda con el id proporcionado", BusinessError.NOT_FOUND)

          const productoTienda: TiendaEntity = producto.tiendas.find(e => e.id === tienda.id);   
          if (!productoTienda) {
            producto.tiendas = [...producto.tiendas, tienda];
          }
        }
        
        return await this.productoRepository.save(producto);
      }
     
    async deleteStoreFromProduct(productoId: string, tiendaId: string){
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
        if (!producto)
          throw new BusinessLogicException("No se encontró el producto con el id indicado", BusinessError.NOT_FOUND)
     
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}});
        if (!tienda)
          throw new BusinessLogicException("No se encontró la tienda con el id proporcionado", BusinessError.NOT_FOUND)
     
        const productoTienda: TiendaEntity = producto.tiendas.find(e => e.id === tienda.id);
     
        if (!productoTienda)
            throw new BusinessLogicException("La tienda no está asociada al producto", BusinessError.PRECONDITION_FAILED)

        producto.tiendas = producto.tiendas.filter(e => e.id !== tiendaId);
        await this.productoRepository.save(producto);
    }   

    async deleteStoresFromProduct(productoId: string){
      const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
      if (!producto)
        throw new BusinessLogicException("No se encontró el producto con el id indicado", BusinessError.NOT_FOUND)
   
      producto.tiendas = [];
      await this.productoRepository.save(producto);
  }
}