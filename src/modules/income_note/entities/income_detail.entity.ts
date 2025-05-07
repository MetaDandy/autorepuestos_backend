import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { DepositProduct } from "../../deposit_product/entities/deposit_product.entity";
import { IncomeNote } from "./income_note.entity";

@Entity({ name: 'income_detail' })
export class IncomeDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total: number;

  @Column({ type: "int" })
  stock_before: number;

  @Column({ type: "int" })
  stock_after: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => IncomeNote, (income_note) => income_note.income_detail)
  income_note: Relation<IncomeNote>;

  @ManyToOne(() => DepositProduct, (deposit_product) => deposit_product.income_detail)
  deposit_product: Relation<DepositProduct>;
}