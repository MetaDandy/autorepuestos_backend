import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { User } from "../../../auth/entities/user.entity";
import { SaleDetail } from "./sale_detail.entity";

@Entity({ name: 'sale_note' })
export class SaleNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  code: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => SaleDetail, (sale_detail) => sale_detail.sale_note)
  sale_detail: Relation<SaleDetail[]>;

  @ManyToOne(() => User, (user) => user.sale_note)
  user: Relation<User>;
}
