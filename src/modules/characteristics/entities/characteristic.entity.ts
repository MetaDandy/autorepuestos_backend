import { DepositProduct } from "../../deposit_product/entities/deposit_product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";

@Entity({ name: 'characteristic' })
export class Characteristic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  color: string;

  @Column()
  is_complete: boolean;

  @Column()
  state: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => DepositProduct, (deposit_product) => deposit_product.characteristic)
  deposit_product: Relation<DepositProduct[]>;
}
