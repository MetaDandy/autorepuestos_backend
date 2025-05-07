import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { DepositProduct } from "../../deposit_product/entities/deposit_product.entity";

@Entity({ name: 'deposit' })
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  place: string;

  @Column()
  code: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @OneToMany(()=> DepositProduct, (deposit_product) => deposit_product.deposit)
  deposit_product: Relation<DepositProduct[]>;
}
