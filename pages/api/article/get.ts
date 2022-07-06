import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { Articles } from 'db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Brackets } from 'typeorm';


async function get(req:NextApiRequest, res:NextApiResponse) {
  const {tag_id=0} = req.query ||{}
  console.log(tag_id)
  const db = await prepareConnection()
  const articleRepo = db.getRepository(Articles)
  let articles =[]
  if (tag_id) {
    articles = await articleRepo.createQueryBuilder('articles')
    .leftJoinAndSelect('articles.tags','tags')
    .leftJoinAndSelect('articles.user','users')
    .where(
      new Brackets((qb)=>{
        qb.where('tags.id=:id',{id:Number(tag_id)})
      })
    )
    .getMany()
  }else {
    articles = await articleRepo.createQueryBuilder('articles')
    .leftJoinAndSelect('articles.tags','tags')
    .leftJoinAndSelect('articles.user','users')
    .getMany()
  }
  res?.status(200).json({
    code:0,
    msg:'',
    data:articles
  })
}

export default withIronSessionApiRoute(get, ironOptions);