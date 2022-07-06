import 'reflect-metadata'
import {BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, ValueTransformer} from 'typeorm'
import { Users } from './user'
import { Articles } from './article'
@Entity({name:'comments'})
// @Tree("closure-table")
export class Comments extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!:number

  @Column()
  content!:string

  @Column()
  create_time!:Date

  @Column()
  update_time!:Date

  @ManyToOne(()=>Users)
  @JoinColumn({name:'user_id'})
  user!:Users

  @ManyToOne(()=>Articles,(articles)=>articles.id)
  @JoinColumn({name:'article_id'})
  article!:Articles

  @BeforeUpdate()
  updateDates() {
    this.update_time = new Date()
  }

  @BeforeInsert()
  updateDate() {
    this.create_time = new Date()
  }

  // @TreeChildren()
  // children!: Commnents[] 

  // @TreeParent()
  // parent!: Commnents 
}

