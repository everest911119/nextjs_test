import 'reflect-metadata'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({name: 'users'})
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  nickname!: string;

  @Column()
  job!: string;
  
  @Column()
  introduce!:string
  @Column()
  avatar!: string;


}