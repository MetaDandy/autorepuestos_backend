import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role_Permission } from "./role_permission.entity";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(()=>Role_Permission, (role_permission)=>role_permission.permission)
  role_permission: Role_Permission[];
}