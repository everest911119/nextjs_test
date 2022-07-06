import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { ISession } from '..';
import { prepareConnection } from 'db';
import { Cookie } from 'next-cookie';
import { setCookie } from 'utils';
import { Users, UserAuth } from 'db/entity/index';
async function login(req: NextApiRequest, res: NextApiResponse) {
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res);
  console.log(session, 'verify code');
  const db = await prepareConnection();
  // const userRepo = db.getRepository(Users);
  const userAuthRepo = db.getRepository(UserAuth);
  if (String(session.verifyCode) === String(verify)) {
    // 验证码正确, 在user_auth表中查找 identity_type是否有记录
    const userAuth = await userAuthRepo.findOne({
      relations: ['user'],
      where: {
        identity_type,
        identifier: phone,
      },
    });
    // console.log(userAuth, 'userAuth');
    if (userAuth) {
      const user = userAuth.user;
      // 已注册
      const { id, nickname, avatar } = user;
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      await session.save();
      setCookie(cookies, { userId: id, nickname, avatar });

      return res.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    } else {
      // console.log('new user')
      // 新用户, 自动注册
      const user = new Users();
      user.nickname = `用户_${Math.floor(Math.random() * 10000)}`;
      user.avatar = '/images/avatar.jpg';
      user.job = '暂无';
      user.introduce = '暂无';
      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = session.verifyCode;
      userAuth.user = user;
      // 设置了cascade:true 可以自动把user信息保存
      const resUserAuth = await userAuthRepo.save(userAuth);
      const {
        user: { id, nickname, avatar },
      } = resUserAuth;
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      await session.save();
      setCookie(cookies, { userId: id, nickname, avatar });
      return res.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    }
  } else {
    return res.status(200).json({
      code: -1,
      msg: '验证码错误',
    });
  }
}

export default withIronSessionApiRoute(login, ironOptions);
