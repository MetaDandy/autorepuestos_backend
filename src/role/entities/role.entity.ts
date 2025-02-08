import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role_Permission } from "./role_permission.entity";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  father_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(()=>Role_Permission, (role_permission)=> role_permission.role)
  role_permission: Role_Permission[];

  @OneToMany(()=>User, (user)=> user.role)
  user: User[];
}
