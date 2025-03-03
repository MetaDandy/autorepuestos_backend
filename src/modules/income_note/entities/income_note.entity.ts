import { User } from "../../../auth/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { IncomeDetail } from "./income_detail.entity";

@Entity({ name: 'income_note' })
export class IncomeNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => IncomeDetail, (income_detail) => income_detail.income_note)
  income_detail: Relation<IncomeDetail[]>;

  @ManyToOne(() => User, (user) => user.income_note)
  user: Relation<User>
}
