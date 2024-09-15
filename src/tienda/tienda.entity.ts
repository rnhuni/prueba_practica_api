import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';

@Entity('producto')
export class TiendaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  ciudad: string;

  @Column()
  direccion: string;

  @ManyToMany(() => ProductoEntity, (producto) => producto.tiendas)
  @JoinTable()
  productos: ProductoEntity[];
}
