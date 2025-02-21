import { Category } from "../../category/entities/category.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";

@Entity({ name: 'category_type' })
export class CategoryType {
    /**
     * TODO: poner la relacion de uno a muchos con tipo producto cuando se cree
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    description: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(()=> Category, (category) => category.category_type)
    category: Relation<Category>;
}
