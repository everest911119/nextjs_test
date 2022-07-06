import { IronSession } from 'iron-session';
export type ISession = IronSession & Record<string, any>;
import { IUserInfo } from 'store/userStore';
export type IArticle = {
  id: number,
  title: string,
  content: string,
  views: number,
  create_time: Date,
  update_time: Date,
  user: IUserInfo,
  comments?:IComment[]
};
export type dbArticle = {
  id: number,
  title: string,
  content: string,
  views: number,
  create_time: Date,
  update_time: Date,
  user: userInfo,
  comments:dbIComment[]
};
interface userInfo {
  id?: number | null;
  nickname?: string;
  avatar?: string;
  introduce?:string
  job?:string
}
export type IComment = {
  id: number,
  content: string,
  create_time: Date,
  update_time: Date,
};

export type dbIComment = {
  id: number,
  content: string,
  create_time: Date,
  update_time: Date,
  user:userInfo
};

export type Itags = {
  id: number,
  icon?:string,
  title?:string,
  follow_count:number,
  article_count:number

}