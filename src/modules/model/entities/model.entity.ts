import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { Brand } from "../../brand/entities/brand.entity";
import { Compatibility } from "../../compatibility/entities/compatibility.entity";

@Entity()
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Compatibility, (compatibility) => compatibility.model)
  compatibility: Relation<Compatibility[]>;

  @ManyToOne(() => Brand, (brand) => brand.model)
  brand: Relation<Brand>;
}
