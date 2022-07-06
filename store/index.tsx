import React,{createContext, useContext} from "react";
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite'
import createStore,{ initialProps, IStore } from "./rootStore";

const StoreContext = createContext({})

interface IProps {
  initialValue : initialProps |null |undefined
  children: React.ReactElement
}

enableStaticRendering(!process.browser)

export const StoreProvider = ({children, initialValue}: IProps) => {
  const store: IStore = useLocalObservable(createStore(initialValue))
  return (
    <StoreContext.Provider value={store} >{children} </StoreContext.Provider>
  )
  
}
  // 接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 <MyContext.Provider> 的 value prop 决定。
export const useStore = () => {
  const store:IStore = useContext(StoreContext) as IStore
  if (!store) {
    throw new Error('数据不存在')
  }
  return store
}
