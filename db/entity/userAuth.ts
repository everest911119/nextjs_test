import 'reflect-metadata'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import {Users} from './user'
@Entity({name: 'user_auth'})
export class UserAuth extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  identity_type!: string;

  @Column()
  identifier!: string;
  
  @Column()
  credential!:string
  
  @ManyToOne(()=>Users,{
    cascade:true
  })
  @JoinColumn({name:'user_id'})
  user!:Users
}