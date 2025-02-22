import { ProductType } from "../../product_type/entities/product_type.entity";
import { Category } from "../../category/entities/category.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";

@Entity({ name: 'category_type' })
export class CategoryType {
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

    @ManyToOne(() => Category, (category) => category.category_type)
    category: Relation<Category>;

    @OneToMany(() => ProductType, (product_type) => product_type.category_type)
    product_type: Relation<ProductType[]>;
}
