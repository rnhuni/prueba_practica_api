import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaController } from './producto-tienda.controller';
import { ProductoTiendaService } from './producto-tienda.service';
import { faker } from '@faker-js/faker';
import { TiendaEntity } from '../tienda/tienda.entity';
import { ProductoEntity } from 'src/producto/producto.entity';

describe('ProductoTiendaController', () => {
  let controller: ProductoTiendaController;
  let service: ProductoTiendaService;
  let tiendaEntities: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoTiendaController],
      providers: [
        {
          provide: ProductoTiendaService,
          useValue: {
            addStoreToProduct: jest.fn(),
            findStoresFromProduct: jest.fn().mockResolvedValue([]),
            findStoreFromProduct: jest.fn().mockResolvedValue(null),
            updateStoresFromProduct: jest.fn().mockResolvedValue([]),
            deleteStoreFromProduct: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductoTiendaController>(ProductoTiendaController);
    service = module.get<ProductoTiendaService>(ProductoTiendaService);

    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaEntities = [];
    for (let i = 0; i < 5; i++) {
      tiendaEntities.push({
        id: faker.string.uuid(),
        nombre: faker.company.name(),
        ciudad: faker.location.city(),
        direccion: faker.location.streetAddress(),
        productos: [],
      });
    }
  };

  it('agrega una tienda a un producto', async () => {
    const productoId = faker.string.uuid();
    const tiendaId = faker.string.uuid();

    await controller.addStoreToProduct(productoId, tiendaId);
    expect(service.addStoreToProduct).toHaveBeenCalledWith(
      productoId,
      tiendaId,
    );
  });

  it('retorna todas las tiendas de un producto', async () => {
    const productoId = faker.string.uuid();
    jest
      .spyOn(service, 'findStoresFromProduct')
      .mockResolvedValue(tiendaEntities);

    const result = await controller.findStoresFromProduct(productoId);
    expect(result).toEqual(tiendaEntities);
    expect(service.findStoresFromProduct).toHaveBeenCalledWith(productoId);
  });

  it('retorna una tienda específica de un producto', async () => {
    const productoId = faker.string.uuid();
    const tienda = tiendaEntities[0];
    jest.spyOn(service, 'findStoreFromProduct').mockResolvedValue(tienda);

    const result = await controller.findStoreFromProduct(productoId, tienda.id);
    expect(result).toEqual(tienda);
    expect(service.findStoreFromProduct).toHaveBeenCalledWith(
      productoId,
      tienda.id,
    );
  });

  it('actualiza las tiendas de un producto', async () => {
    const productoId = faker.string.uuid();
    const producto: ProductoEntity = {
      id: productoId,
      nombre: faker.commerce.productName(),
      precio: parseFloat(faker.commerce.price()),
      tipo: 'Perecedero',
      tiendas: [],
    };
    jest.spyOn(service, 'updateStoresFromProduct').mockResolvedValue(producto);
    const tiendaIds = tiendaEntities.map((tienda) => tienda.id);
    const result = await controller.updateStoresFromProduct(
      productoId,
      tiendaIds,
    );
    expect(result).toEqual(producto);
    expect(service.updateStoresFromProduct).toHaveBeenCalledWith(
      productoId,
      tiendaIds,
    );
  });

  it('elimina una tienda de un producto', async () => {
    const productoId = faker.string.uuid();
    const tiendaId = faker.string.uuid();

    await controller.deleteStoreFromProduct(productoId, tiendaId);
    expect(service.deleteStoreFromProduct).toHaveBeenCalledWith(
      productoId,
      tiendaId,
    );
  });
});
