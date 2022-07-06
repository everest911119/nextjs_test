import userStore,{IUserInfo, IUserStore} from './userStore'

export interface IStore {
  user: IUserStore
}

export interface initialProps {
  user:{
    userinfo:IUserInfo
  }
}

export default function createStore(initialValue:initialProps|undefined |null):()=>IStore {
  return () => {
    return {
      user: {...userStore(),...initialValue?.user}
    }
  }
}