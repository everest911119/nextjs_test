import ListItem from 'components/ListItem';
import { prepareConnection } from 'db';
import { Articles, Tags } from 'db/entity';
import type { GetServerSideProps } from 'next';
import { IArticle, Itags } from './api';
import classnames from 'classnames'
import { Divider } from 'antd';
import styles from './index.module.scss'
import * as ANTD_ICONS from '@ant-design/icons'
import React,{ useEffect, useState } from 'react';
import requestInstance from 'service/fetch';
interface Iprops {
  articles: IArticle[];
  tags?:Itags[]
}

const Home = (props: Iprops) => {
  const { articles,tags } = props;
  const [selectTag,setSelectTag] = useState(0)
  const [showArticles, setShowArticles] = useState([...articles])
  // console.log(articles)
  // console.log(tags)
  const handleSelectTag = (event:any) =>{
    const {tagid} = event?.target?.dataset || {}
    setSelectTag(Number(tagid))
  }
  useEffect(()=> {
    console.log(selectTag)
    selectTag && requestInstance.get(`/api/article/get?tag_id=${selectTag}`).then((res:any)=>{
      if (res?.code===0) {
        setShowArticles([...res.data])
      }
    })
  },[selectTag])
  return (
    <div>
      <div className={styles.tags} onClick={handleSelectTag}>
        {
          tags?.map((tag)=> {
            console.log(tag.id,selectTag)
            return <div key={tag.id} className={classnames(styles.tag, selectTag===Number(tag.id) ? styles['active'] : '' )} 
            data-tagid={tag?.id}

            >
              {(ANTD_ICONS as any)[tag.icon|| 'HTML5Outlined']?.render()}
             {tag?.title} 
            </div>
          }
            
            
          )
        }
      </div>
      <div className="content-layout">
        {showArticles?.map((article) => (
          <div key={article.id}>
            <ListItem article={article} />
            <Divider />
          </div>
        ))}
      </div>
    </div>
  );
};
// Home.getInitialProps= async(ctx) => {
//   const db = await prepareConnection()
//   const articles = await db.getRepository(Articles).find({
//     relations: ['user']
//   })
//   return {
//     test:'123',
//     props: articles
//   }
// }
export const getServerSideProps: GetServerSideProps<Iprops> = async (
  // eslint-disable-next-line no-unused-vars
  context
) => {
  // console.log(context.req.cookies);
  const db = await prepareConnection();
  const articles = await db.getRepository(Articles).find({
    relations: ['user','tags'],
  });
  const tags = await db.getRepository(Tags).find({
    relations:['users']
  })
  // console.log(articles);
  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
      tags: JSON.parse(JSON.stringify(tags)) || []
    },
  };
};

export default Home;
