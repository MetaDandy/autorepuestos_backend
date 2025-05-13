import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

@Entity({ name: 'audit' })
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  action: string;

  @Column()
  route: string;

  @Column()
  method: string;

  @Column({ type: 'jsonb', nullable: true })
  payload:  Record<string, unknown> | null;

  @Column()
  ip: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.audit, { nullable: true, onDelete: 'SET NULL' })
  user: Relation<User>;
}
