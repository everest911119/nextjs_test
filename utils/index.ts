import { Cookie } from 'next-cookie';
import { useCallback, useEffect } from 'react';

interface ICookieInfo {
  userId: number;
  nickname: string;
  avatar: string;
}

export const setCookie = (
  cookies: Cookie,
  { userId, nickname, avatar }: ICookieInfo
) => {
  // 24小时登录失效
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';
  cookies.set('userId', userId, {
    path,
    expires,
  });
  cookies.set('nickname', nickname, {
    path,
    expires,
  });
  cookies.set('avatar', avatar, {
    path,
    expires,
  });
};

export const clearCookie = (cookies: Cookie) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';
  cookies.set('userId', '', {
    path,
    expires,
  });
  cookies.set('nickname', '', {
    path,
    expires,
  });
  cookies.set('avatar', '', {
    path,
    expires,
  });
};

export const useMount = (callback: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cb = useCallback(() => callback(), []);
  useEffect(() => {
    cb();
  }, [cb]);
};
