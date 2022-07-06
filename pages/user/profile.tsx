import { useEffect } from 'react'
import {Form,Input,Button, Spin, message} from 'antd'
import { observer } from 'mobx-react-lite'
import styles from './index.module.scss'
import { useAsync } from 'utils/use-aync'
import { userInfo } from 'pages/api'
import { useMount } from 'utils'
import requestInstance from 'service/fetch'
import { useRouter } from 'next/router'
interface formValue {
  nickname:string,
  job:string
  introduce:string
}
const layout = {
  labelCol:{span:4},
  wrapperCol:{span:16}
}
const tailLayout = {
  wrapperCol:{offset:4}
}
const UserProfile =() => {
  const router = useRouter()
  const [form] = Form.useForm()
  const {run, data, isLoading} = useAsync<userInfo>()
  const getUsers = async () => {
    const res: any = await requestInstance.get('/api/user/detail')
    if (res.code===0) {
      
      return res.data
    }
  }
  useMount(()=>{
    run(getUsers(),{retry:getUsers})
  })
  useEffect(()=>{
    form.setFieldsValue(data)
  },[data,form])
  const handleSubmit=(value:formValue) => {
    requestInstance.post('/api/user/update',{...value}).then((res:any)=>{
      if (res?.code ===0) {
        message.success('修改成功')
        router.push('/')
      }else {
        message.error('修改失败')
      }
    })
  }
  return (
       <div className='content-layout'>
        <div className={styles.userProfile}>
           <h2>个人资料</h2>
           <div>
            {
              isLoading ? <Spin size='large'/> :
              <Form {...layout} form={form} onFinish={handleSubmit}>
              <Form.Item label='用户名' name='nickname'>
                <Input placeholder='请输入用户名' />
              </Form.Item>
              <Form.Item label='职位' name='job'>
                <Input placeholder='请输入职位' />
              </Form.Item>
              <Form.Item label='个人介绍' name='introduce'>
                <Input placeholder='个人介绍' />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type='primary'htmlType='submit'>保存修改</Button>
              </Form.Item>
            </Form>
            }
            
           </div>
        </div>
     
    </div>
  )
 
}

export default observer(UserProfile)