import { useCallback,useState, useReducer, useRef, useEffect } from "react";

interface State<D> {
  error: Error | null,
  data: D | null,
  state:'idle' | 'loading' | 'error' | 'success'
}

const defaultInitialState: State<null>= {
  state:'idle',
  data:null,
  error: null
}
const defaultConfig = {
  throwOnError: false
}

const useMountedRef = () => {
  const mountedRef = useRef(false)
  useEffect(()=> {
    mountedRef.current = true
    return ()=> {
      mountedRef.current = false
    }
  })
  return mountedRef
}

const useSafeDispatch = <T>(dispatch:(...args:T[])=>void)=> {
  const mountedRef = useMountedRef()
  return useCallback((...args:T[])=>{mountedRef.current ? dispatch(...args): void 0},[dispatch,mountedRef])
}


export const useAsync = <D>(initialState?:State<D>,initialConfig?:typeof defaultConfig) => {
  const config = {...defaultConfig,...initialConfig}
  const [state, dispatch] = useReducer((state:State<D>,action:Partial<State<D>>)=> {
    return {...state,...action}
  },{...defaultInitialState,...initialState})
  const safeDispatch = useSafeDispatch(dispatch)
  const setData = useCallback((data:D)=>safeDispatch({
    error: null,
    state:'success',
    data
  }),[safeDispatch])
  const setError = useCallback((error:Error)=> safeDispatch({
    error,
    state:'error',
    data:null
  }),[safeDispatch])

  const [retry, setRetry] = useState(()=>()=>{})


  const run = useCallback((promise:Promise<D>,runConfig?:{retry:()=>Promise<D>})=>{
    if (!promise || !promise.then) {
      throw new Error('请传入promise数据类型')
    }
    setRetry(()=>()=>{
      if (runConfig?.retry){
        run(runConfig?.retry(),runConfig)
      }
    })
    safeDispatch({state:'loading'})
    return promise.then(data=>{
      setData(data)
      return data
    }).catch(err=>{
      setError(err)
      if (config.throwOnError) {
        return Promise.reject(err)
      }
      return err
    })


  },[config.throwOnError, setData, setError, safeDispatch])

  return {
    isIdle: state.state === 'idle',
    isLoading: state.state === 'loading',
    isError: state.state === 'error',
    isSuccess:state.state ==='success',
    run,
    setData,
    setError,
    // retry被调用是重新跑一遍run让state刷新
    retry,
    ...state,
  }


}
