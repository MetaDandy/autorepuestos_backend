import { Product } from "../../product/entities/product.entity";
import { Deposit } from "../../deposit/entities/deposit.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { IncomeDetail } from "../../income_note/entities/income_detail.entity";
import { EgressDetail } from "../../egress_note/entities/egress_detail.entity";
import { SaleDetail } from "../../sale_note/entities/sale_detail.entity";

@Entity({ name: 'deposit_product' })
export class DepositProduct {

  //Todo: ver si conectar con stock movement

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
  income_detail: Relation<IncomeDetail[]>;

  @OneToMany(() => EgressDetail, (egress_detail) => egress_detail.deposit_product)
  egress_detail: Relation<EgressDetail[]>;

  @OneToMany(() => SaleDetail, (sale_detail) => sale_detail.sale_note)
  sale_detail: Relation<SaleDetail[]>;

  @ManyToOne(() => Deposit, (deposit) => deposit.deposit_product)
  deposit: Relation<Deposit>;

  @ManyToOne(() => Product, (product) => product.deposit_product)
  product: Relation<Product>;
}
