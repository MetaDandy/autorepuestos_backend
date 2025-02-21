import { Role } from "../../role/entities/role.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  supabase_user_id: string;

  @Column({nullable: true})
  refresh_token: string;

  @Column()
  name: string;
  
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({nullable: true})
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Role, (role) => role.user)
  role: Relation<Role>;
}
