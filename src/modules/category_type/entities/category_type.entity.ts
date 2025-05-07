import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { Category } from "../../category/entities/category.entity";
import { ProductType } from "../../product_type/entities/product_type.entity";

@Entity({ name: 'category_type' })
export class CategoryType {
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

    @ManyToOne(() => Category, (category) => category.category_type)
    category: Relation<Category>;

    @OneToMany(() => ProductType, (product_type) => product_type.category_type)
    product_type: Relation<ProductType[]>;
}
