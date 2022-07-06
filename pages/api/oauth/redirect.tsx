import type { NextApiRequest, NextApiResponse } from 'next';
import { ironOptions, Oath_URL } from 'config';
const { client_id, client_secret, request_token_url } = Oath_URL.github;
import requestInstance from 'service/fetch';
import { Cookie } from 'next-cookie';
import { withIronSessionApiRoute } from 'iron-session/next';
import { prepareConnection } from 'db';
import { UserAuth, Users } from 'db/entity';
import { ISession } from '..';
import { setCookie } from 'utils';
async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  console.log(session, 'session');
  console.log(req?.query, req.cookies, 'cookies');
  const redirectLocation = req.cookies.redirect;
  const { code } = req.query || {};
  console.log(code);
  if (!code) {
    return res.status(200).json({
      code: -1,
      msg: '错误',
    });
  }

  const result: any = await requestInstance.post(
    request_token_url,
    {
      client_id,
      client_secret,
      code,
    },
    {
      headers: {
        accept: 'application/json',
      },
    }
  );
  if (result?.error) {
    return res.status(200).json({
      code: -1,
      msg: result?.error,
    });
  }
  const userInfoRepos: Record<any, any> = await requestInstance.get(
    'https://api.github.com/user',
    {
      headers: {
        accept: 'application/json',
        Authorization: `${result.token_type} ${result.access_token}`,
      },
    }
  );
  const { login = '', avatar_url = '', id: git_id } = userInfoRepos;
  console.log(userInfoRepos);
  const cookie = Cookie.fromApiRoute(req, res);
  const db = await prepareConnection();
  const userAuthRepo = db.getRepository(UserAuth);
  const userAuth = await userAuthRepo.findOne({
    relations: ['user'],
    where: {
      identity_type: 'github',
      identifier: git_id,
    },
  });
  if (userAuth) {
    // 之前登录过的账号
    const user = userAuth.user;
    const { id, nickname, avatar } = user;
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;
    await session.save();
    console.log('session done');
    setCookie(cookie, { userId: id, nickname, avatar });
    userAuth.credential = result.access_token;

    await userAuthRepo.save(userAuth);
    res.redirect(redirectLocation)
  } else {
    // 新用户注册

    const user = new Users();
    user.nickname = login;
    user.avatar = avatar_url;
    user.job = '暂无';
    user.introduce = '暂无';
    const userAuth = new UserAuth();
    userAuth.identity_type = 'github';
    userAuth.identifier = git_id;
    userAuth.credential = result.access_token;
    userAuth.user = user;
    const resUserAuth = await userAuthRepo.save(userAuth);
    const { id, nickname, avatar } = resUserAuth?.user || {};
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;
    await session.save();
    setCookie(cookie, { userId: id, nickname, avatar });
    res.redirect(redirectLocation)
  }
}

export default withIronSessionApiRoute(redirect, ironOptions);
