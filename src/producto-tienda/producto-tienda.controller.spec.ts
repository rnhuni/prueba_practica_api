import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaService } from './producto-tienda.service';
import { ProductoService } from '../producto/producto.service';
import { TiendaService } from '../tienda/tienda.service';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let productoService: ProductoService;
  let tiendaService: TiendaService;
  let producto: ProductoEntity;
  let tiendas: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoTiendaService,
        {
          provide: ProductoService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: TiendaService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoService = module.get<ProductoService>(ProductoService);
    tiendaService = module.get<TiendaService>(TiendaService);

    seedDatabase();
  });

  const seedDatabase = () => {
    producto = {
      id: faker.string.uuid(),
      nombre: faker.commerce.productName(),
      precio: parseFloat(faker.commerce.price()),
      tipo: 'Perecedero',
      tiendas: [],
    } as ProductoEntity;

    tiendas = Array.from({ length: 5 }, () => ({
      id: faker.string.uuid(),
      nombre: faker.company.name(),
      ciudad: faker.string.alpha({ length: 3 }).toUpperCase(),
      direccion: faker.location.streetAddress(),
      productos: [],
    })) as TiendaEntity[];
  };

  it('agrega una tienda a un producto', async () => {
    jest.spyOn(productoService, 'findOne').mockResolvedValue(producto);
    jest.spyOn(tiendaService, 'findOne').mockResolvedValue(tiendas[0]);

    await service.addStoreToProduct(producto.id, tiendas[0].id);

    expect(producto.tiendas).toHaveLength(1);
    expect(producto.tiendas[0].id).toBe(tiendas[0].id);
    expect(productoService.update).toHaveBeenCalled();
  });

  it('lanzar una excepción si la tienda ya está asociada', async () => {
    producto.tiendas.push(tiendas[0]);
    jest.spyOn(productoService, 'findOne').mockResolvedValue(producto);
    jest.spyOn(tiendaService, 'findOne').mockResolvedValue(tiendas[0]);

    await expect(
      service.addStoreToProduct(producto.id, tiendas[0].id),
    ).rejects.toThrow(BusinessLogicException);
  });

  it('retorna todas las tiendas de un producto', async () => {
    producto.tiendas = tiendas;
    jest.spyOn(productoService, 'findOne').mockResolvedValue(producto);

    const result = await service.findStoresFromProduct(producto.id);
    expect(result).toHaveLength(5);
    expect(result).toEqual(tiendas);
  });

  it('retornar va tienda específica de un producto', async () => {
    producto.tiendas = tiendas;
    jest.spyOn(productoService, 'findOne').mockResolvedValue(producto);

    const tienda = await service.findStoreFromProduct(
      producto.id,
      tiendas[0].id,
    );
    expect(tienda).toEqual(tiendas[0]);
  });

  it('lanza una excepción si la tienda no está asociada al producto', async () => {
    producto.tiendas = [];
    jest.spyOn(productoService, 'findOne').mockResolvedValue(producto);

    await expect(
      service.findStoreFromProduct(producto.id, tiendas[0].id),
    ).rejects.toThrow(BusinessLogicException);
  });

  it('actualiza las tiendas de un producto', async () => {
    jest.spyOn(productoService, 'findOne').mockResolvedValue(producto);
    jest
      .spyOn(tiendaService, 'findOne')
      .mockResolvedValueOnce(tiendas[0])
      .mockResolvedValueOnce(tiendas[1]);

    const updatedTiendas = await service.updateStoresFromProduct(producto.id, [
      tiendas[0].id,
      tiendas[1].id,
    ]);

    expect(updatedTiendas).toHaveLength(2);
    expect(producto.tiendas[0]).toEqual(tiendas[0]);
    expect(producto.tiendas[1]).toEqual(tiendas[1]);
    expect(productoService.update).toHaveBeenCalled();
  });

  it('elimina una tienda de un producto', async () => {
    producto.tiendas.push(tiendas[0]);
    jest.spyOn(productoService, 'findOne').mockResolvedValue(producto);

    await service.deleteStoreFromProduct(producto.id, tiendas[0].id);

    expect(producto.tiendas).toHaveLength(0);
    expect(productoService.update).toHaveBeenCalled();
  });

  it('lanza una excepción si se intenta eliminar una tienda no asociada', async () => {
    producto.tiendas = [];
    jest.spyOn(productoService, 'findOne').mockResolvedValue(producto);

    await expect(
      service.deleteStoreFromProduct(producto.id, tiendas[0].id),
    ).rejects.toThrow(BusinessLogicException);
  });
});
