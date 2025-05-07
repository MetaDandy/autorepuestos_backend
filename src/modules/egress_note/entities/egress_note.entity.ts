import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { User } from "../../../auth/entities/user.entity";
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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @OneToMany(()=> EgressDetail, (egress_detail)=> egress_detail.egress_note)
  egress_detail: Relation<EgressDetail[]>;

  @ManyToOne(()=> User, (user)=> user.egress_note)
  user: Relation<User>;
}
