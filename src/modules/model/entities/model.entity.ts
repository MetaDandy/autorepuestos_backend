import { Compatibility } from "../../compatibility/entities/compatibility.entity";
import { Brand } from "../../brand/entities/brand.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";

@Entity()
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Compatibility, (compatibility) => compatibility.model)
  compatibility: Relation<Compatibility[]>;

  @ManyToOne(() => Brand, (brand) => brand.model)
  brand: Relation<Brand>;
}
