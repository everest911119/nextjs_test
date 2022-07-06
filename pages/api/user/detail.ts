import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ISession } from '..';
import { prepareConnection } from 'db';
import { Users } from 'db/entity';
import { ironOptions } from 'config';
import { EXCEPTION_USER } from '../config/code';

async function detail(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session
  const {userId} = session
  const db = await prepareConnection()
  const userRepo = db.getRepository(Users)
  const user = await userRepo.findOne({
    where:{
      id: Number(userId)
    }
  })
  if (user) {
    res.status(200).json({
      code:0,
      msg:'',
      data: user
    })
  }else {
    res.status(200).json({
      ...EXCEPTION_USER.NOT_FOUND
    })
  }
}

export default withIronSessionApiRoute(detail,ironOptions)