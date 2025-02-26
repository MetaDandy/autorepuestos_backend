import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'deposit' })
export class Deposit {

  // Todo: conectar con deposit_product

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  place: string;

  @Column()
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
