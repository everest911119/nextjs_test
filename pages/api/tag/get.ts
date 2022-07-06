import {NextApiRequest, NextApiResponse} from 'next'

import { withIronSessionApiRoute } from 'iron-session/next'
import { ISession } from '..'
import { prepareConnection } from 'db'
import { Tags } from 'db/entity'
import { ironOptions } from 'config'
import { Brackets } from 'typeorm'

async function get(req:NextApiRequest, res:NextApiResponse) {
  const session:ISession = req.session
  const {userId = 0} = session
  const db = await prepareConnection()
  const tagRepo = db.getRepository(Tags)
  const followTags = await tagRepo.createQueryBuilder('tags').innerJoinAndSelect('tags.users','users').where(
    new Brackets((qb)=> {
      qb.where('user_id=:id',{
        id:userId
      })
    })
  ).getMany()
  // console.log(followTags)
  const allTags = await tagRepo.createQueryBuilder('tags').leftJoinAndSelect('tags.users','users').getMany()

  res.status(200).json({
    code:0,
    msg:'',
    data: {
      followTags,
      allTags
    }
  })
}

export default withIronSessionApiRoute(get,ironOptions)