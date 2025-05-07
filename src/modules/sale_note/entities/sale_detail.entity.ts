import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { DepositProduct } from "../../deposit_product/entities/deposit_product.entity";
import { SaleNote } from "./sale_note.entity";

@Entity({ name: 'sale_detail' })
export class SaleDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

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

  @ManyToOne(() => SaleNote, (sale_note) => sale_note.sale_detail)
  sale_note: Relation<SaleNote>;

  @ManyToOne(() => DepositProduct, (deposit_product) => deposit_product.sale_detail)
  deposit_product: Relation<DepositProduct>;
}