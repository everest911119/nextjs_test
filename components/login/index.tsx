import { useCallback, useState } from 'react';
import { message } from 'antd';
import request from 'service/fetch';
import styles from './index.module.scss';
import React,{memo} from 'react';
import CountDown from 'components/CountDown';
import { useStore } from 'store/index';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { Oath_URL as Config } from 'config';
import { useCookie } from 'next-cookie';
interface IProps {
  isShow: boolean;
  onClose: () => void;
}

const Login = ((props: IProps) => {
  const cookie = useCookie();
  const { isShow = false, onClose } = props;
  const router = useRouter();
  // console.log(router?.asPath);
  const store = useStore();
  // console.log('2222', store);
  const handleClose = () => {};
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });
  const handleCountDownend = () => {
    setIsShowVerifyCode(false);
  };
  const handleGetVerifyCode = useCallback(() => {
    // setIsShowVerifyCode(true)
    if (!form?.phone) {
      message.warning('请输入手机号');
      return;
    }
    request
      .post('/api/user/sendVerifyCode', {
        to: form?.phone,
        templateId: 1,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          setIsShowVerifyCode(true);
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  }, [form]);
  const handleLogin = () => {
    request
      .post('/api/user/login', {
        ...form,
        identity_type: 'phone',
      })
      .then((res: any) => {
        if (res?.code === 0) {
          // 登录成功
          store.user.setUserInfo(res?.data);
          // console.log(store);
          onClose && onClose();
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };
  const handleOAuthGithub = () => {
    cookie.set('redirect', router?.asPath);
    const redirectURI = process.env.NEXT_PUBLIC_REDIRECT
    console.log(`${Config.OAUTH_URL}&redirect_uri=${redirectURI}`);
    window.location.replace(`${Config.OAUTH_URL}&redirect_uri=${redirectURI}`);
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登录</div>
          <div className={styles.close} onClick={handleClose}>
            X
          </div>
        </div>
        <input
          type="text"
          name="phone"
          placeholder="请输入手机号"
          value={form.phone}
          onChange={handleFormChange}
        />
        <div className={styles.verifyCodeArea}>
          <input
            type="text"
            name="verify"
            placeholder="请输入验证码"
            onChange={handleFormChange}
          />
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            {isShowVerifyCode ? (
              <CountDown time={10} onEnd={handleCountDownend} />
            ) : (
              '獲取驗證碼'
            )}
          </span>
        </div>
        <div className={styles.loginButton} onClick={handleLogin}>
          登录
        </div>
        <div className={styles.otherLogin} onClick={handleOAuthGithub}>
          使用GitHub登录
        </div>
        <div className={styles.loginPrivacy}>
          注册登录即表示同意
          <a href="http://www.google.com" target={'_blank'} rel="noreferrer">
            协议
          </a>
        </div>
      </div>
    </div>
  ) : null;
});

export default memo(observer(Login));
