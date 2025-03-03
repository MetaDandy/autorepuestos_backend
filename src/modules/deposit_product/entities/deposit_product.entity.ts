import { Product } from "src/modules/product/entities/product.entity";
import { Deposit } from "../../deposit/entities/deposit.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { IncomeDetail } from "src/modules/income_note/entities/income_detail.entity";

@Entity({ name: 'deposit_product' })
export class DepositProduct {

  //Todo: conectar con details de: sales, egress; ver si conectar con stock movement

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => IncomeDetail, (income_detail) => income_detail.deposit_product)
  income_detail: Relation<IncomeDetail>;

  @ManyToOne(() => Deposit, (deposit) => deposit.deposit_product)
  deposit: Relation<Deposit>;

  @ManyToOne(() => Product, (product) => product.deposit_product)
  product: Relation<Product>;
}
