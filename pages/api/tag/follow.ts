import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { Tags, Users } from 'db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { Brackets } from 'typeorm';
import { ISession } from '..';
import { EXCEPTION_TAG, EXCEPTION_USER } from '../config/code';

async function follow(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId = 0 } = session;
  const { tagId, type } = req.body;
  const db = await prepareConnection();
  const tagRepo = db.getRepository(Tags);
  const userRepo = db.getRepository(Users);
  const user = await userRepo.findOne({
    where: {
      id: userId,
    },
  });
  const tag = await tagRepo
    .createQueryBuilder('tags')
    .leftJoinAndSelect('tags.users', 'users')
    .where(
      new Brackets((qb) => {
        qb.where('tags.id=:id', {
          id: tagId,
        });
      })
    )
    .getOne();
  // const tag = await tagRepo.findOne({
  //   relations: ['users'],
  //   where: {
  //     id: tagId,
  //   },
  // });
  // console.log(tag);
  if (!user) {
    res?.status(200).json({
      ...EXCEPTION_USER.NOT_LOGIN,
    });
    return;
  }
  if (tag?.users) {
    if (type === 'follow') {
      tag.users = tag?.users.concat([user]);
      tag.follow_count = tag.follow_count + 1;
    } else if (type === 'unFollow') {
      tag.users = tag?.users?.filter((user) => user.id !== userId);
      tag.follow_count = tag.follow_count - 1;
    }
  }
  if (tag) {
    const tagRes = await tagRepo.save(tag);
    res.status(200).json({
      code: 0,
      msg: '',
      data: tagRes,
    });
  } else {
    res?.status(200)?.json({
      ...EXCEPTION_TAG?.FOLLOW_FAILED,
    });
  }
}

export default withIronSessionApiRoute(follow, ironOptions);
