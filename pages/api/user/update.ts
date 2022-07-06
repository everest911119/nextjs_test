import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ISession } from '..';
import { prepareConnection } from 'db';
import { Users } from 'db/entity';
import { ironOptions } from 'config';
import { EXCEPTION_USER } from '../config/code';

async function update(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session
  const {nickname='', job='', introduce=''} = req.body
  const {userId} = session
  const db = await prepareConnection()
  const userRepo = db.getRepository(Users)
  const user = await userRepo.findOne({
    where:{
      id: Number(userId)
    }
  })
  if (user) {
    user.nickname = nickname
    user.job =job
    user.introduce = introduce
    const resUser = await userRepo.save(user)
    res.status(200).json({
      code:0,
      msg:'',
      data: resUser
    })
  }else {
    res.status(200).json({
      ...EXCEPTION_USER.NOT_FOUND
    })
  }
}

export default withIronSessionApiRoute(update,ironOptions)