import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { Characteristic } from "../../characteristics/entities/characteristic.entity";
import { Deposit } from "../../deposit/entities/deposit.entity";
import { EgressDetail } from "../../egress_note/entities/egress_detail.entity";
import { IncomeDetail } from "../../income_note/entities/income_detail.entity";
import { Product } from "../../product/entities/product.entity";
import { SaleDetail } from "../../sale_note/entities/sale_detail.entity";

@Entity({ name: 'deposit_product' })
export class DepositProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_code: string;

  @Column()
  characteristic_code: string;

  @Column()
  stock: number;

  @Column({ nullable: true })
  price: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

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

  @ManyToOne(() => Characteristic, (characteristic) => characteristic.deposit_product)
  characteristic: Relation<Characteristic>;
}
