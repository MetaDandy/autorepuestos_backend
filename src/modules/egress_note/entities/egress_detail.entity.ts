import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { DepositProduct } from "../../deposit_product/entities/deposit_product.entity";
import { EgressNote } from "./egress_note.entity";

@Entity({ name: 'egress_detail' })
export class EgressDetail {
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

  @ManyToOne(()=> EgressNote, (egress_note)=> egress_note.egress_detail)
  egress_note: Relation<EgressNote>;

  @ManyToOne(()=> DepositProduct, (deposit_product)=> deposit_product.egress_detail)
  deposit_product: Relation<DepositProduct>;
}