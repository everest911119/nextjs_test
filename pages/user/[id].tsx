import { Avatar, Button, Divider } from 'antd';
import { prepareConnection } from 'db';
import { Articles, Users } from 'db/entity';
import type { GetServerSideProps, NextPage } from 'next';
import { IArticle, Itags, userInfo } from 'pages/api';
import styles from './index.module.scss';
import {
  FireOutlined,
  CodeOutlined,
  FundViewOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import ListItem from 'components/ListItem';
interface IProps {
  userInfo?: userInfo;
  articles?: Omit<IArticle & { tags: Itags[] }, 'comments'>[];
}
const UserPage: NextPage = (props: IProps) => {
  const { userInfo = {}, articles = [] } = props;
  const viewsCount = articles?.reduce((prev, cur) => {
    return prev + cur.views;
  }, 0);
  return (
    <div className={styles.userDetail}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <Avatar className={styles.avatar} src={userInfo?.avatar} size={90} />
          <div>
            <div className={styles.nickname}>{userInfo?.nickname}</div>
            <div className={styles.desc}>
              <CodeOutlined /> {userInfo?.introduce}
            </div>
          </div>

          <div className={styles.desc}>
            <FireOutlined /> {userInfo?.job}
          </div>

          <Link href={'/user/profile'}>
            <Button>编辑个人资料</Button>
          </Link>
        </div>

        <Divider />
        <div className={styles.article}>
          {articles?.map((article) => (
            <div key={article.id}>
              <ListItem article={article} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.achievement}>
          个人成就
          <div className={styles.number}>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>共创作{articles?.length}文章</span>
            </div>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>共阅读{viewsCount}文章</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const userId = params?.id;
  const db = await prepareConnection();
  const userRepo = db.getRepository(Users);
  const user = await userRepo.findOne({
    where: {
      id: Number(userId),
    },
  });
  const articleRepo = db.getRepository(Articles);
  const article = await articleRepo
    .createQueryBuilder('article')
    .leftJoinAndMapOne(
      'article.user',
      Users,
      'users',
      'article.user_id=users.id'
    )
    .leftJoinAndSelect('article.tags', 'tags')
    .where('users.id =:userId', { userId })
    .getMany();

  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(user)),
      articles: JSON.parse(JSON.stringify(article)),
    },
  };
};

export default UserPage;
