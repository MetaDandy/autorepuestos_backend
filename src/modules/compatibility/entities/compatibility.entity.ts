import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { Model } from "../../model/entities/model.entity";
import { Product } from "../../product/entities/product.entity";

@Entity({ name: 'compatibility' })
export class Compatibility {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  year: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Product, (product) => product.compatibility)
  product: Relation<Product>;

  @ManyToOne(() => Model, (model) => model.compatibility)
  model: Relation<Model>;
}