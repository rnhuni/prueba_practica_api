import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoService,
        {
          provide: getRepositoryToken(ProductoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto = await repository.save({
        nombre: faker.commerce.productName(),
        precio: parseFloat(faker.commerce.price()),
        tipo: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
      });
      productosList.push(producto);
    }
  };

  it('findAll retorna todos los productos', async () => {
    const productos = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne retorna un producto por id', async () => {
    const storedProducto = productosList[0];
    const producto = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
    expect(producto.precio).toEqual(storedProducto.precio);
  });

  it('findOne lanza una excepción por un id inválido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('create retorna un nuevo producto', async () => {
    const producto: ProductoEntity = {
      id: '',
      nombre: faker.commerce.productName(),
      precio: parseFloat(faker.commerce.price()),
      tipo: 'Perecedero',
      tiendas: [],
    };

    const newProducto = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto = await repository.findOne({
      where: { id: newProducto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre);
    expect(storedProducto.precio).toEqual(newProducto.precio);
  });

  it('update modifica un producto existente', async () => {
    const producto = productosList[0];
    const updateProductoDto = {
      nombre: faker.commerce.productName(),
      precio: parseFloat(faker.commerce.price()),
      tipo: 'No perecedero',
    };

    const updatedProducto = await service.update(
      producto.id,
      updateProductoDto,
    );
    expect(updatedProducto).not.toBeNull();

    const storedProducto = await repository.findOne({
      where: { id: producto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(updateProductoDto.nombre);
    expect(storedProducto.precio).toEqual(updateProductoDto.precio);
  });

  it('delete elimina un producto', async () => {
    const producto = productosList[0];
    await service.delete(producto.id);

    const deletedProducto = await repository.findOne({
      where: { id: producto.id },
    });
    expect(deletedProducto).toBeNull();
  });

  it('delete lanzar una excepción por un id inválido', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no existe',
    );
  });
});
