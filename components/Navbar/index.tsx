import type { NextPage } from 'next';
import { navs } from './config';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Avatar, Button, Dropdown, Menu, message } from 'antd';
import { memo, useCallback, useState } from 'react';

import { useStore } from 'store';
import { LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import request from 'service/fetch';
import { observer } from 'mobx-react-lite';
const NavBar: NextPage = () => {
  console.log('navbarrrrr')
  const store = useStore();
  // console.log(store);
  const { pathname, push } = useRouter();
  const { userId, avatar } = store.user.userinfo;


  // eslint-disable-next-line no-unused-vars
  const [isShowLogin, setIsShowLogin] = useState(false);
  const handleLogin = useCallback(() => {
    setIsShowLogin(true);
  }, [setIsShowLogin]);
  // eslint-disable-next-line no-unused-vars
  const handleClose = useCallback(() => {
    setIsShowLogin(false);
  }, [setIsShowLogin]);
  // 文章发布页
  const handleGotoEditorPage = () => {
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('请先登录');
    }
  };
  // 个人中文
  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`)
  }
  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res.code === 0) {
        store.user.setUserInfo({});
      }
    });
  };
  const renderDropDownMenu = () => {
    return (
      <Menu
        items={[
          {
            key: '主页',
            label: '个人主页',
            icon: <HomeOutlined />,
            onClick: handleGotoPersonalPage
          },
          {
            key: '退出',
            label: '退出',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
          },
        ]}
      ></Menu>
    );
  };
  return (
    <div className={styles.navbar}>
      <section className={styles.logArea}>BLOG-c</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link href={nav?.value} key={nav.label}>
            <a className={pathname === nav.value ? styles.active : 'active'}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>

        {userId ? (
          <>
            <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
              <Avatar src={avatar} size={32} />
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
      </section>
      {/* <Login isShow={isShowLogin} onClose={handleClose} /> */}
    </div>
  );
};
// observer包裹Navbar当数据有变化时自动触发更新渲染
export default memo(observer(NavBar));
