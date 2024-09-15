import { Test, TestingModule } from '@nestjs/testing';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { faker } from '@faker-js/faker';
import { ProductoDto } from './producto.dto';

describe('ProductoController', () => {
  let controller: ProductoController;
  let service: ProductoService;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoController],
      providers: [
        {
          provide: ProductoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(null),
            update: jest.fn().mockResolvedValue(null),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductoController>(ProductoController);
    service = module.get<ProductoService>(ProductoService);

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productosList = [];
    for (let i = 0; i < 5; i++) {
      productosList.push({
        id: faker.string.uuid(),
        nombre: faker.commerce.productName(),
        precio: parseFloat(faker.commerce.price()),
        tipo: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
        tiendas: [],
      });
    }
  };

  it('retorna todos los productos', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue(productosList);

    const result = await controller.findAll();
    expect(result).toEqual(productosList);
  });

  it('retorna un producto por id', async () => {
    const producto = productosList[0];
    jest.spyOn(service, 'findOne').mockResolvedValue(producto);

    const result = await controller.findOne(producto.id);
    expect(result).toEqual(producto);
  });

  it('crea un nuevo producto', async () => {
    const productoDto: ProductoDto = {
      nombre: faker.commerce.productName(),
      precio: parseFloat(faker.commerce.price()),
      tipo: 'Perecedero',
    };

    const newProducto: ProductoEntity = {
      id: faker.string.uuid(),
      ...productoDto,
      tiendas: [],
    };

    jest.spyOn(service, 'create').mockResolvedValue(newProducto);

    const result = await controller.create(productoDto);
    expect(result).toEqual(newProducto);
  });

  it('actualiza un producto existente', async () => {
    const producto = productosList[0];
    const updateProductoDto: ProductoDto = {
      nombre: faker.commerce.productName(),
      precio: parseFloat(faker.commerce.price()),
      tipo: 'No perecedero',
    };

    const updatedProducto: ProductoEntity = {
      ...producto,
      ...updateProductoDto,
    };

    jest.spyOn(service, 'update').mockResolvedValue(updatedProducto);

    const result = await controller.update(producto.id, updateProductoDto);
    expect(result).toEqual(updatedProducto);
  });

  it('elimina un producto por id', async () => {
    const producto = productosList[0];

    jest.spyOn(service, 'delete').mockResolvedValue(undefined);

    await controller.delete(producto.id);
    expect(service.delete).toHaveBeenCalledWith(producto.id);
  });
});
