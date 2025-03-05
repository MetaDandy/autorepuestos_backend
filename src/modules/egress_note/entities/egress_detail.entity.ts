import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { EgressNote } from "./egress_note.entity";
import { DepositProduct } from "../../deposit_product/entities/deposit_product.entity";

@Entity({ name: 'egress_detail' })
export class EgressDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(()=> EgressNote, (egress_note)=> egress_note.egress_detail)
  egress_note: Relation<EgressNote>;

  @ManyToOne(()=> DepositProduct, (deposit_product)=> deposit_product.egress_detail)
  deposit_product: Relation<DepositProduct>;
}