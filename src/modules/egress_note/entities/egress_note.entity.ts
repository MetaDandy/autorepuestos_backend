import { User } from "../../../auth/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { EgressDetail } from "./egress_detail.entity";

@Entity({ name: 'egress_note' })
export class EgressNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  code: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(()=> EgressDetail, (egress_detail)=> egress_detail.egress_note)
  egress_detail: Relation<EgressDetail[]>;

  @ManyToOne(()=> User, (user)=> user.egress_note)
  user: Relation<User>;
}
