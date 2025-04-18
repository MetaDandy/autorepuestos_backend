import { ProductType } from "../../product_type/entities/product_type.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { ProductImage } from "./product_image.entity";
import { Compatibility } from "../../compatibility/entities/compatibility.entity";
import { DepositProduct } from "../../deposit_product/entities/deposit_product.entity";

@Entity({ name: 'product' })
export class Product {  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column()
  technology: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => ProductImage, (product_image) => product_image.product)
  product_image: Relation<ProductImage[]>;

  @OneToMany(() => Compatibility, (compatibility) => compatibility.product)
  compatibility: Relation<Compatibility[]>;

  @OneToMany(() => DepositProduct, (deposit_product) => deposit_product.product)
  deposit_product: Relation<DepositProduct[]>;

  @ManyToOne(() => ProductType, (product_type) => product_type.product)
  product_type: Relation<ProductType>;
}
