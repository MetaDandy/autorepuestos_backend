import { CategoryType } from "../../category_type/entities/category_type.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";

@Entity({ name: 'product_type' })
export class ProductType {
  // Todo: conectar con productos

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(()=> CategoryType, (category_type) => category_type.product_type)
  category_type: Relation<CategoryType>
}
