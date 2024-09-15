import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';

@Entity('producto')
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column('decimal')
  precio: number;

  @Column()
  tipo: string;

  @ManyToMany(() => TiendaEntity, (tienda) => tienda.productos)
  tiendas: TiendaEntity[];
}
