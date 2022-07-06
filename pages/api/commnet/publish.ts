import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { Articles, Comments, Users } from 'db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from '..';
import { EXCEPTION_COMMENT } from '../config/code';

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { articleId = 0, content = '' } = req.body;
  const db = await prepareConnection();
  const commentRepo = db.getRepository(Comments);
  const comment = new Comments();
  comment.content = content;
  // comment.create_time = new Date();
  // comment.update_time = new Date();
  const user = await db.getRepository(Users).findOne({
    where: {
      id: session?.userId,
    },
  });
  const article = await db.getRepository(Articles).findOne({
    where: {
      id: articleId,
    },
  });
  if (user) {
    comment.user = user;
  }
  if (article) {
    comment.article = article;
  }
  const resComment = await commentRepo.save(comment);
  if (resComment) {
    res.status(200).json({
      code: 0,
      msg: '发布成功',
      data: resComment,
    });
  } else {
    res.status(200).json({
      ...EXCEPTION_COMMENT.PUBLISH_FAILED,
    });
  }
}

export default withIronSessionApiRoute(publish, ironOptions);
