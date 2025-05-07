import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { DepositProduct } from "../../deposit_product/entities/deposit_product.entity";

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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => DepositProduct, (deposit_product) => deposit_product.characteristic)
  deposit_product: Relation<DepositProduct[]>;
}
