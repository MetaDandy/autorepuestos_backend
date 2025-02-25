import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { Model } from "../../model/entities/model.entity";

@Entity({ name: 'compatibility' })
export class Compatibility {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  year: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Product, (product) => product.compatibility)
  product: Relation<Product>;

  @ManyToOne(() => Model, (model) => model.compatibility)
  model: Relation<Model>;
}