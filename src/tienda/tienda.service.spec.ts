import { Test, TestingModule } from '@nestjs/testing';
import { TiendaService } from './tienda.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiendaService,
        {
          provide: getRepositoryToken(TiendaEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.string.alpha({ length: 3 }).toUpperCase(),
        direccion: faker.location.streetAddress(),
        productos: [],
      });
      tiendasList.push(tienda);
    }
  };

  it('findAll retorna todas las tiendas', async () => {
    const tiendas = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendasList.length);
  });

  it('findOne retornabuna tienda por id', async () => {
    const storedTienda = tiendasList[0];
    const tienda = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre);
  });

  it('findOne lanzar una excepción por un id inválido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'No se encontró la tienda con la identificación proporcionada.',
    );
  });

  it('create retorna una nueva tienda', async () => {
    const tienda: TiendaEntity = {
      id: '',
      nombre: faker.company.name(),
      ciudad: faker.string.alpha({ length: 3 }).toUpperCase(),
      direccion: faker.location.streetAddress(),
      productos: [],
    };

    const newTienda = await service.create(tienda);
    expect(newTienda).not.toBeNull();

    const storedTienda = await repository.findOne({
      where: { id: newTienda.id },
    });
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(newTienda.nombre);
    expect(storedTienda.ciudad).toEqual(newTienda.ciudad);
  });

  it('update modifica una tienda existente', async () => {
    const tienda = tiendasList[0];
    const updateTiendaDto = {
      nombre: faker.company.name(),
      ciudad: faker.string.alpha({ length: 3 }).toUpperCase(),
      direccion: faker.location.streetAddress(),
    };

    const updatedTienda = await service.update(tienda.id, updateTiendaDto);
    expect(updatedTienda).not.toBeNull();

    const storedTienda = await repository.findOne({ where: { id: tienda.id } });
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(updateTiendaDto.nombre);
    expect(storedTienda.ciudad).toEqual(updateTiendaDto.ciudad);
  });

  it('delete elimina una tienda', async () => {
    const tienda = tiendasList[0];
    await service.delete(tienda.id);

    const deletedTienda = await repository.findOne({
      where: { id: tienda.id },
    });
    expect(deletedTienda).toBeNull();
  });

  it('delete lanza una excepción por un id inválido', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'No se encontró la tienda.',
    );
  });
});
