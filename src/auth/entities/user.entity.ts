import { Role } from "src/role/entities/role.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique: true})
  supabase_user_id: string;

  @Column()
  refresh_token: string;

  @ManyToOne(()=> Role, (role)=> role.user)
  role: Role;
}
