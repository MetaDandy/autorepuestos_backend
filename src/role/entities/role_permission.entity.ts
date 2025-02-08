import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";

@Entity()
export class Role_Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(()=> Role, (role)=>role.role_permission)
  @JoinColumn({name: 'role_id'})
  role: Role;

  @ManyToOne(()=> Permission, (permission)=>permission.role_permission)
  @JoinColumn({name: 'permission_id'})
  permission: Permission;
}