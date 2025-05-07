import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { User } from "../../../auth/entities/user.entity";
import { IncomeDetail } from "./income_detail.entity";

@Entity({ name: 'income_note' })
export class IncomeNote {
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

  @OneToMany(() => IncomeDetail, (income_detail) => income_detail.income_note)
  income_detail: Relation<IncomeDetail[]>;

  @ManyToOne(() => User, (user) => user.income_note)
  user: Relation<User>
}
