import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";

@Entity()
export class Role_Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(()=> (Role), (role)=>role.role_permission, {nullable: false})
  @JoinColumn({name: 'role_id'})
  role: Promise<Role>;

  @ManyToOne(()=> Permission, (permission)=>permission.role_permission, {nullable: false})
  @JoinColumn({name: 'permission_id'})
  permission: Promise<Permission>;
}