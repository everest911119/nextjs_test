import { prepareConnection } from 'db';
import { Articles } from 'db/entity';
import { GetServerSideProps } from 'next';
import styles from './index.module.scss';
import { dbArticle, dbIComment } from '../api';
import { Avatar, Button, Divider, Input, message } from 'antd';
import { useStore } from 'store';
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import { format } from 'date-fns';
import { useState } from 'react';
import requestInstance from 'service/fetch';
interface Iprops {
  article: dbArticle;
}
const ArticleDetail = (props: Iprops) => {
  console.log('article detailll')
  const store = useStore();
  const logInUserInfo = store.user.userinfo;
  const [inputValue, setInputValue] = useState('');
  const article = props?.article;
  const [comments, setComments] = useState(article.comments||[])
  const {
    user: { nickname, avatar, id: userId }
  } = article;
  const update_date = new Date(article.update_time);
  const handleComment = () => {
    requestInstance
      .post('/api/commnet/publish', {
        articleId: article.id,
        content: inputValue,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('发布成功');
          const {id, create_time, content, user,update_time} = res.data as dbIComment
          const newComment = {
            id,
            create_time,
            update_time,
            content,
            user
          }
          setComments([...comments,newComment])
          setInputValue('');
        } else {
          message.error('发布失败');
        }
      });
  };
  // const dateTime = `${date.getFullYear()}-${
  //   (date.getMonth() + 1 + '').length === 1
  //     ? `0${date.getMonth() + 1}`
  //     : date.getMonth() + 1
  // }-${date.getDate()}`;
  return (
    <div>
      <div className="content-layout">
        <h2 className={styles.title}></h2>
        <div className={styles.user}>
          <Avatar src={avatar} size={50} />
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div>{format(update_date, 'yyyy-MM-dd hh:mm:ss')}</div>

              <div>阅读 {article.views}</div>
              {Number(logInUserInfo.userId) === Number(userId) ? (
                <Link href={`/editor/${article.id}`}>
                  <a>编辑</a>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
        <Markdown className={styles.markdown}>{article.content}</Markdown>
      </div>
      <div className={styles.divider}></div>
      <div className="content-layout">
        <div className={styles.comment}>
          <h3>评论</h3>
          {logInUserInfo?.userId && (
            <div className={styles.enter}>
              <Avatar src={avatar} size={40} />
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="输入评论"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button type="primary" onClick={handleComment}>
                  评论
                </Button>
              </div>
            </div>
          )}
          <Divider />
          <div className={styles.display}>
            {comments?.map((comment) => (
              <div className={styles.wrapper} key={comment?.id}>
                <Avatar src={comment?.user.avatar} size={40} />
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment?.user?.nickname}</div>
                    <div className={styles.data}>
                      {format(
                        new Date(comment.create_time),
                        'yyyy-MM-dd hh:mm:ss'
                      )}
                    </div>
                  </div>
                  <div className={styles.content}>{comment.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const articleId = Number(ctx.params?.id);
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Articles);
  const article = await articleRepo.findOne({
    relations: ['user', 'comments', 'comments.user'],
    where: {
      id: articleId,
    },
  });
  // const article2 = await articleRepo.createQueryBuilder('article').leftJoinAndMapOne('article.user',Users,'users','article.user_id = users.id')
  // .leftJoinAndMapMany('article.comments',Comments,'comments','article.id = comments.article_id')
  // .where('article.id=:id',{id:articleId})
  // .getMany()
  // console.log(article2,'article22323')
  if (article) {
    // 阅读次数
    article.views = article.views + 1;
    await articleRepo.save(article);
  }
  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || {},
    },
  };
};
export default ArticleDetail;
