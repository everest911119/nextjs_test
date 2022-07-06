
import React, { useCallback } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ComponentType, useState } from 'react';
import { BaseContext, NextPageContext } from 'next/dist/shared/lib/utils';
import sytles from './index.module.scss'
import { Button, Input, message, Select, Spin } from 'antd';
import request from 'service/fetch'
import { useStore } from 'store';
import { getIronSession } from 'iron-session';
import { ironOptions } from 'config';
import { ISession } from 'pages/api';
import { IncomingMessage, ServerResponse } from 'http';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useAsync } from 'utils/use-aync';
import { Response } from 'pages/tags';
import { useMount } from 'utils';
import requestInstance from 'service/fetch';
const isSever = typeof window ==='undefined'
// eslint-disable-next-line no-undef
type NextComponentType<C extends BaseContext = NextPageContext, IP = {}, P = {}> = ComponentType<P> & {
  /**
   * Used for initial page load data population. Data returned from `getInitialProps` is serialized when server rendered.
   * Make sure to return plain `Object` without using `Date`, `Map`, `Set`.
   * @param ctx Context of `page`
   */
  // eslint-disable-next-line no-unused-vars
  getInitialProps?(context: C): IP | Promise<IP>,
  layout?: any
};
export type NextPageEditor<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P>

// 去除


// const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
const MDRender = dynamic(()=>import('components/MarkDwon/index'),{ssr: false} )
const New:NextPageEditor = () => {
  const store = useStore()
  const userId = store.user.userinfo.userId
  const router = useRouter()
  const [content, setContent] = useState('**Hello world!!!*');
  const [title,setTitle] = useState('')
  const handleTitleChange = (e:React.ChangeEvent <HTMLInputElement>) => {
    setTitle(e?.target.value)
  }
  const handleContentChange = (content:string|undefined ) => {
    setContent(content||'')
  }
  const [tagIds, setTagIds] = useState<number[]>()
  const {data, isLoading, run,} = useAsync<Response>()
  const getTags = useCallback(async() => {
    const res: any = await requestInstance('api/tag/get')
    if (res.code===0){
      return res.data
    }
  },[])
  useMount(()=>{
    run(getTags())
  })
  const handleSelectTag = useCallback((value:number[])=>{
    console.log(value,'value')
    setTagIds(value)
  },[])
  // console.log(tagIds&&tagIds.length>0&&tagIds,'tagids')
  const handlePublish = () => {
    if (!title) {
      message.warning('文章标题')
    }else {
      request.post('/api/article/publish',{
        title,
        content,
        tagIds:tagIds&&tagIds.length>0 ? tagIds : undefined
      }).then((res:any)=> {
        if (res?.code === 0) {
          // 跳转
          message.success('发布成功')
          userId ? router.push(`/user/${userId}`) : router.push('/')
        } else {
          message.error(res?.msg || '发布失败')
        }
      })
    }
  }
  if (!userId) {
    return <div>登录</div>
  }
  return (
   
    <div className={sytles.container}>
      <div className={sytles.operation}>
        <Input className={sytles.title} placeholder="请输入文章标题" value={title} onChange={handleTitleChange} />
        {
          isLoading ? <Spin size='small'/> : <Select className={sytles.tag} 
          mode='multiple'
          allowClear
          placeholder='选择标签'
          onChange={handleSelectTag}
          >
            {
              data?.allTags?.map((tag)=>(
                <Select.Option key={tag.id} value={tag.id}>{tag?.title}</Select.Option>
              ))
            }
          </Select>
        }
        <Button className={sytles.button} type='primary' onClick={handlePublish}>发布</Button>
      </div>
      <MDRender value={content} handleContentChange={handleContentChange} height={1080} />
      
    </div>
  );
};

New.layout = null
New.getInitialProps = async(appContext) => {
  if (!isSever){
    return {}
  }
  const {req , res} = appContext


  const context: ISession = await getIronSession(
    req as IncomingMessage,
    res as ServerResponse,
    ironOptions
  );
  if (!context.userId) {
    // res.writeHead 跳转页面
    // res.end()结束跳转
    res?.writeHead(302,{
      Location:'/'
    })
    res?.end()
  }
  return {
    
  }
}
export default observer(New);



// function createArray<C extends Book= any>(args:C[]):C {
//   return args[0]
// }
// console.log(createArray([{title:'123', author:'123', isbn:'123',name:'2323'}]))