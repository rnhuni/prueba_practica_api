import { Test, TestingModule } from '@nestjs/testing';
import { TiendaController } from './tienda.controller';
import { TiendaService } from './tienda.service';
import { TiendaEntity } from './tienda.entity';
import { faker } from '@faker-js/faker';
import { TiendaDto } from './tienda.dto';

describe('TiendaController', () => {
  let controller: TiendaController;
  let service: TiendaService;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiendaController],
      providers: [
        {
          provide: TiendaService,
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

    controller = module.get<TiendaController>(TiendaController);
    service = module.get<TiendaService>(TiendaService);

    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      tiendasList.push({
        id: faker.string.uuid(),
        nombre: faker.company.name(),
        ciudad: faker.string.alpha({ length: 3 }).toUpperCase(),
        direccion: faker.location.streetAddress(),
        productos: [],
      });
    }
  };

  it('retorna todas las tiendas', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue(tiendasList);

    const result = await controller.findAll();
    expect(result).toEqual(tiendasList);
  });

  it('retorna una tienda por id', async () => {
    const tienda = tiendasList[0];
    jest.spyOn(service, 'findOne').mockResolvedValue(tienda);

    const result = await controller.findOne(tienda.id);
    expect(result).toEqual(tienda);
    expect(result.ciudad).toHaveLength(3);
  });

  it('crear una nueva tienda', async () => {
    const tiendaDto: TiendaDto = {
      nombre: faker.company.name(),
      ciudad: faker.string.alpha({ length: 3 }).toUpperCase(),
      direccion: faker.location.streetAddress(),
    };

    const newTienda: TiendaEntity = {
      id: faker.string.uuid(),
      ...tiendaDto,
      productos: [],
    };

    jest.spyOn(service, 'create').mockResolvedValue(newTienda);

    const result = await controller.create(tiendaDto);
    expect(result).toEqual(newTienda);
    expect(result.ciudad).toHaveLength(3);
  });

  it('actualiza una tienda existente', async () => {
    const tienda = tiendasList[0];
    const updateTiendaDto: TiendaDto = {
      nombre: faker.company.name(),
      ciudad: faker.string.alpha({ length: 3 }).toUpperCase(),
      direccion: faker.location.streetAddress(),
    };

    const updatedTienda: TiendaEntity = {
      ...tienda,
      ...updateTiendaDto,
    };

    jest.spyOn(service, 'update').mockResolvedValue(updatedTienda);

    const result = await controller.update(tienda.id, updateTiendaDto);
    expect(result).toEqual(updatedTienda);
    expect(result.ciudad).toHaveLength(3);
  });

  it('eliminar una tienda por id', async () => {
    const tienda = tiendasList[0];

    jest.spyOn(service, 'delete').mockResolvedValue(undefined);

    await controller.delete(tienda.id);
    expect(service.delete).toHaveBeenCalledWith(tienda.id);
  });
});
