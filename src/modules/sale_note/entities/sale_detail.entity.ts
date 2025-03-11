import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { SaleNote } from "./sale_note.entity";
import { DepositProduct } from "../../deposit_product/entities/deposit_product.entity";

@Entity({ name: 'sale_detail' })
export class SaleDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  discount: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total_discount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => SaleNote, (sale_note) => sale_note.sale_detail)
  sale_note: Relation<SaleNote>;

  @ManyToOne(() => DepositProduct, (deposit_product) => deposit_product.sale_detail)
  deposit_product: Relation<DepositProduct>;
}