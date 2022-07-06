import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { ISession } from '..';
import { Cookie } from 'next-cookie';
import { clearCookie } from 'utils';
async function logout(req: NextApiRequest, res: NextApiResponse) {
  // 清除session
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res);
  await session.destroy();
  clearCookie(cookies);
  res.status(200).json({
    code: 0,
    msg: '退出成功',
    data: {},
  });
}

export default withIronSessionApiRoute(logout, ironOptions);
