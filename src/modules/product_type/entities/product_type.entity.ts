import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { CategoryType } from "../../category_type/entities/category_type.entity";
import { Product } from "../../product/entities/product.entity";

@Entity({ name: 'product_type' })
export class ProductType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Product, (product) => product.product_type)
  product: Relation<Product[]>;

  @ManyToOne(() => CategoryType, (category_type) => category_type.product_type)
  category_type: Relation<CategoryType>;
}
