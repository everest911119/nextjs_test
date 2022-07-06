import 'reflect-metadata'
import { BaseEntity, BeforeUpdate, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Users } from './user'
import {ValueTransformer} from 'typeorm';
import { Comments } from './comment';
import { Tags } from './tag';
class BoolBitTransformer implements ValueTransformer {
  // To db from typeorm
  to(value: boolean | null): Buffer | null {
    if (value === null) {
      return null;
    }
    const res = Buffer.alloc(1);
    res[0] = value ? 1 : 0;
    return res;
  }
  // From db to typeorm
  from(value: Buffer): boolean | null {
    if (value === null) {
      return null;
    }
    return value[0] === 1;
  }
}
@Entity({name:'articles' })
export class Articles extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  title!:string

  @Column()
  content!: string

  @Column()
  views!: number

  @Column()
  create_time!: Date

  @Column()
  update_time!: Date

  @Column({
    type: 'bit',
    nullable: true,
    default: () => `"'b'1''"`,
    name: 'is_delete',
    transformer: new BoolBitTransformer()
  })
  is_delete!: boolean

  @ManyToOne(()=>Users,{
    cascade: true
  })
  @JoinColumn({name:'user_id'})
  user!: Users

  @OneToMany(()=>Comments,(comments)=>comments.article)
  comments!:Comments[]

  @BeforeUpdate()
  updateDate() {
    this.update_time = new Date()
  }

  @ManyToMany(()=>Tags,(tags)=>tags.articles)
  tags!:Tags[]
}