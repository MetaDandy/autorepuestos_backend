import { IncomeNote } from "../../modules/income_note/entities/income_note.entity";
import { Role } from "../../role/entities/role.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { EgressNote } from "../../modules/egress_note/entities/egress_note.entity";
import { SaleNote } from "../../modules/sale_note/entities/sale_note.entity";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  supabase_user_id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => IncomeNote, (income_note) => income_note.user)
  income_note: Relation<IncomeNote[]>

  @OneToMany(()=> EgressNote, (egress_note)=>egress_note.user)
  egress_note: Relation<EgressNote[]>;

  @OneToMany(()=> SaleNote, (sale_note)=> sale_note.user)
  sale_note: Relation<SaleNote[]>;

  @ManyToOne(() => Role, (role) => role.user)
  role: Relation<Role>;
}
