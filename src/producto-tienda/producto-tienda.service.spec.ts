/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoTiendaService } from './producto-tienda.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let producto: ProductoEntity;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    tiendaRepository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();

    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.string.alpha({ length: 3 }).toUpperCase(),
        direccion: faker.location.streetAddress(),
      });
      tiendasList.push(tienda);
    }

    producto = await productoRepository.save({
      nombre: faker.commerce.productName(),
      precio: parseFloat(faker.commerce.price()),
      tipo: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
      tiendas: tiendasList,
    });
  };

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('agrega tienda a producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.string.alpha({ length: 3 }).toUpperCase(),
      direccion: faker.location.streetAddress(),
    });

    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      precio: parseFloat(faker.commerce.price()),
      tipo: 'Perecedero',
    });

    const result: ProductoEntity = await service.addStoreToProduct(
      newProducto.id,
      newTienda.id,
    );

    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(result.tiendas[0].ciudad).toBe(newTienda.ciudad);
    expect(result.tiendas[0].direccion).toBe(newTienda.direccion);
  });

  it('lanza una exepción por tienda inválida', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      precio: parseFloat(faker.commerce.price()),
      tipo: 'Perecedero',
    });

    await expect(() =>
      service.addStoreToProduct(newProducto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la tienda con el id proporcionado',
    );
  });

  it('lanza una exepción por producto inválido', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.string.alpha({ length: 3 }).toUpperCase(),
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.addStoreToProduct('0', newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con el id indicado',
    );
  });

  it('debe retornoar la tienda de un producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    const storedTienda: TiendaEntity =
      await service.findStoreFromProduct(producto.id, tienda.id);
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toBe(tienda.nombre);
    expect(storedTienda.ciudad).toBe(tienda.ciudad);
    expect(storedTienda.direccion).toBe(tienda.direccion);
  });

  it('debería lanzar una excepción para una tienda no válida', async () => {
    await expect(() =>
      service.findStoreFromProduct(producto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la tienda con el id proporcionado',
    );
  });

  it('debería lanzar una excepción para un producto no válido', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(() =>
      service.findStoreFromProduct('0', tienda.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con el id indicado',
    );
  });

  it('should throw an exception for an tienda not associated to the producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.string.alpha({ length: 3 }).toUpperCase(),
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.findStoreFromProduct(producto.id, newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'La tienda no está asociada al producto',
    );
  });

  it('deberia traer todas las tiendas de un producto', async () => {
    const tiendas: TiendaEntity[] = await service.findStoresFromProduct(
      producto.id,
    );
    expect(tiendas.length).toBe(5);
  });

  it('debería lanzar una excepción para un producto no válido', async () => {
    await expect(() =>
      service.findStoresFromProduct('0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con el id indicado',
    );
  });

  it('debería lanzar una excepción para un producto no válido', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.string.alpha({ length: 3 }).toUpperCase(),
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.addStoreToProduct('0', newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con el id indicado',
    );
  });

  it('debería lanzar una excepción para una tienda no válida', async () => {
    const newTienda: TiendaEntity = tiendasList[0];
    newTienda.id = '0';

    await expect(() =>
      service.addStoreToProduct(producto.id, newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la tienda con el id proporcionado',
    );
  });

  it('debería lanzarse una excepción para una tienda no asociada', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.string.alpha({ length: 3 }).toUpperCase(),
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.deleteStoreFromProduct(producto.id, newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'La tienda no está asociada al producto',
    );
  });

  it('debería lanzar una excepción para un producto no válido', async () => {
    await expect(() =>
      service.deleteStoresFromProduct('0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con el id indicado',
    );
  });

  it('debería lanzar una excepción para un producto no válido', async () => {
    await expect(() =>
      service.deleteStoreFromProduct('0', '0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con el id indicado',
    );
  });
});
