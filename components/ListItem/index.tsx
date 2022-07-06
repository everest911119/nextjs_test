import Link from 'next/link';
import { IArticle } from 'pages/api';
import styles from './index.module.scss';
import { EyeOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import {formatDistanceToNow} from 'date-fns'
import {markdownToTxt} from 'markdown-to-txt'
interface ListProps {
  article: IArticle;
}

const ListItem = (props: ListProps) => {
  const { article } = props;
  const date = new Date(article.create_time);
  // const dateTime = `${date.getFullYear()}-${
  //   (date.getMonth() + 1 + '').length === 1
  //     ? `0${date.getMonth() + 1 + ''}`
  //     : date.getMonth() + 1 + ''
  // }-${date.getDate()}`;
  const dateTime = formatDistanceToNow(date)
  return (
    <Link href={`/article/${article.id}`}>
      <div className={styles.container}>
        <div className={styles.article}>
          <div className={styles.userInfo}>
            <span className={styles.name}>{article.user.nickname}</span>
            <span className={styles.date}>{dateTime}</span>
          </div>
          <h4 className={styles.title}>{article?.title}</h4>
          <p className={styles.content}>{markdownToTxt(article?.content)}</p>
          <div className={styles.statistics}>
            <EyeOutlined />
           <span>{article?.views}</span>
          </div>
        </div>
        <div className={styles.avatar}>
          <Avatar src={article.user.avatar}/>
        </div>
      </div>
    </Link>
  );
};

export default ListItem;
