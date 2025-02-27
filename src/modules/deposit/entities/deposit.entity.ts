import { DepositProduct } from "../../deposit_product/entities/deposit_product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";

@Entity({ name: 'deposit' })
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  place: string;

  @Column()
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(()=> DepositProduct, (deposit_product) => deposit_product.deposit)
  deposit_product: Relation<DepositProduct[]>;
}
