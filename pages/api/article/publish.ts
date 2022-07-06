import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { Articles, Tags, Users } from 'db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from '..';
import { EXCEPTION_ARTICLE } from '../config/code';

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { title = '', content = '', tagIds = [0] } = req.body;
  const db = await prepareConnection();
  const userRepo = db.getRepository(Users);
  const tagRepo = db.getRepository(Tags);
  const user = await userRepo.findOne({
    where: {
      id: session.userId,
    },
  });
  // let tags: Tags[] | undefined
  // if (tagIds.length>0){
  //   tags = await tagRepo
  //   .createQueryBuilder('tags')
  //   .where('tags.id in (:...tagIds)', { tagIds })
  //   .getMany();
  // console.log(tags);
  // }
  // console.log(tagIds, 'tagids');
  const tags = await tagRepo
    .createQueryBuilder('tags')
    .where('tags.id in (:...tagIds)', { tagIds })
    .getMany();
  // console.log(tags);

  const articleRepo = db.getRepository(Articles);
  const article = new Articles();
  article.title = title;
  article.content = content;
  article.create_time = new Date();
  article.update_time = new Date();
  article.is_delete = false;
  article.views = 0;
  if (tags) {
    const newTags = tags?.map((tag) => {
      tag.article_count = tag.article_count + 1;
      return tag;
    });
    // eslint-disable-next-line no-unused-vars
    const resTags = await tagRepo.save(newTags);
    article.tags = newTags;
  }

  if (user) {
    article.user = user;
  } else {
    return res.status(200).json({
      code: -1,
      msg: '没有登录',
    });
  }
  const resArticle = await articleRepo.save(article);

  if (resArticle) {
    return res.status(200).json({
      code: 0,
      data: resArticle,
      msg: '发布成功',
    });
  } else {
    return res.status(200).json({
      ...EXCEPTION_ARTICLE.PUBLISH_FAILED,
    });
  }
}

export default withIronSessionApiRoute(publish, ironOptions);
