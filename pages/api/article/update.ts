import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { Articles, Tags } from 'db/entity';

import { withIronSessionApiRoute } from 'iron-session/next';

import type { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from '..';
import { EXCEPTION_ARTICLE } from '../config/code';

async function upldate(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { title = '', content = '', id = 0, tagIds = [0] } = req.body;
  const db = await prepareConnection();
  const tagRepo = db.getRepository(Tags);
  const articleRepo = db.getRepository(Articles);
  console.log(tagIds);
  const tags = await tagRepo
    .createQueryBuilder('tags')
    .where('tags.id in (:...tagIds)', { tagIds })
    .getMany();
  const article = await articleRepo.findOne({
    where: {
      id,
      user: session.userId,
    },
    relations: ['user'],
  });
  if (article) {
    article.title = title;
    article.content = content;
    if (tags) {
      const newTags = tags?.map((tag) => {
        tag.article_count = tag.article_count + 1;
        return tag;
      });
      // eslint-disable-next-line no-unused-vars
      const resTags = await tagRepo.save(newTags);
      article.tags = newTags;
    }
    const resArticle = await articleRepo.save(article);
    if (resArticle) {
      res.status(200).json({
        data: resArticle,
        code: 0,
        msg: '更新成功',
      });
    } else {
      res.status(200).json({
        ...EXCEPTION_ARTICLE.UPDATE_FAILED,
      });
    }
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.NOT_FOUND });
  }
}

export default withIronSessionApiRoute(upldate, ironOptions);
