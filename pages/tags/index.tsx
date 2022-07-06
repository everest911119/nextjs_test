
import { userInfo } from 'pages/api';
import React, {useCallback } from 'react';
import {Button, message, Spin, Tabs} from 'antd'
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import * as ANTD_ICONS from '@ant-design/icons'
import requestInstance from 'service/fetch';
const {TabPane} = Tabs
import styles from './index.module.scss'
import { useAsync } from 'utils/use-aync';
import { useMount } from 'utils';
import { ErrorBox } from 'components/lib';

interface ITag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users?:userInfo[]
}

export interface Response {
  followTags?:ITag[] | null,
  allTags?:ITag[] | null
}

const Tag = () => {
  const store = useStore()
  const {userId} = store.user.userinfo
  const {data, error, isLoading, run, isError, retry} = useAsync<Response>()
  const getTags = async() => {
    const res: any = await requestInstance('api/tag/get')
    if (res.code===0){
      return res.data
    }
  }
  const handlefollow = useCallback((tagId:number)=>{
    requestInstance.post('/api/tag/follow',{
      tagId,
      type:'follow'
    }).then((res:any)=>{
      if (res.code ===0) {
        message.success('关注成功')
        retry()
      } else {
        message.error(res.msg || '关注失败')
      }
    })

  },[retry])
  const handleUnfollow = useCallback((tagId:number)=>{
    requestInstance.post('/api/tag/follow',{
      tagId,
      type:'unFollow'
    }).then((res:any)=>{
      if (res.code ===0) {
        message.success('取关成功')
        retry()
      } else {
        message.error(res.msg || '取关失败')
      }
    })
  },[retry])
  useMount(()=>{
    run(getTags(),{retry:getTags})
  })
  if (isError) {
    return <div style={{height:'100%', display:'flex', justifyContent:'center',alignItems:'center', position:'fixed'}} >
       <ErrorBox error={error}></ErrorBox>
    </div>
  }
  return (

    <div className='content-layout' >
      {
        isLoading ? <Spin size='large'></Spin> :
          <Tabs defaultActiveKey='follow'>
        <TabPane tab='以关注标签' key='follow' className={styles.tags} > 
          {
            
            data?.followTags?.map(tag=> (
              <div key={tag.title} className={styles.tagWrapper} >
                <div>{(ANTD_ICONS as any )[tag.icon]?.render()}</div>
                <div className={styles.title} >{tag?.title}</div>
                <div>{tag?.follow_count}关注 {tag?.article_count} 文章</div>
                {
                  tag?.users?.find(user=>Number(user?.id)===Number(userId)) ? 
                  <Button onClick={()=>handleUnfollow(tag.id)}>以关注</Button> : <Button onClick={()=>handlefollow(tag.id)}>关注</Button>
                }
              </div>
            ))
          }
        </TabPane>
        <TabPane tab="全部标签" key='all' className={styles.tags}>
        {
            
            data?.allTags?.map(tag=> (
              <div key={tag.title} className={styles.tagWrapper} >
                <div>{(ANTD_ICONS as any )[tag.icon]?.render()}</div>
                <div className={styles.title} >{tag?.title}</div>
                <div>{tag?.follow_count}关注 {tag?.article_count} 文章</div>
                {
                  tag?.users?.find(user=>Number(user?.id)===Number(userId)) ? 
                  <Button onClick={()=>handleUnfollow(tag.id)}>以关注</Button> : <Button onClick={()=>handlefollow(tag.id)}>关注</Button>
                }
              </div>
            ))
          }
        </TabPane>
      </Tabs>
      }
    
    </div>
  )
};

export default observer(Tag);
