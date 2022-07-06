import 'reflect-metadata'
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './user';
import { Articles } from './article';
@Entity({name:'tags' })
export class Tags extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  title!:string

  @Column()
  icon!:string

  @Column()
  follow_count!:number

  @Column()
  article_count!: number

  @ManyToMany(()=>Users,{
    cascade:true
  } )
  @JoinTable({
    name:'tags_users_rel',
    joinColumn: {
      name:'tag_id',
      referencedColumnName: "id",
    },
    inverseJoinColumn:{
      name:'user_id',
      referencedColumnName: "id",
    }
  })
  users!:Users[]

  @ManyToMany(()=>Articles,(article)=>article.tags)
  @JoinTable({
    name:'articles_tags_rel',
    joinColumn: {
      name:'tag_id',
      referencedColumnName:'id'
    },
    inverseJoinColumn:{
      name:'article_id',
      referencedColumnName:'id'
    }
  })
  articles!: Articles[]
}