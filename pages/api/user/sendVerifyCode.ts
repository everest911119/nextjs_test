import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { ISession } from '..';
const AccountId = 'AC55726494776c003ad071656bcfef969b';
const Token = '7ca30cc73ccd03afb4a4c71b4bef2bca';
const client = require('twilio')(AccountId, Token);

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
 
  const session: ISession = req.session;
  const { to = '', templateId } = req.body;
  console.log(to);
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  console.log(templateId);
  try {
    const message = await client.messages.create({
      body: `verifyCode is ${verifyCode}`,
      from: '+19033548345',
      to: `+1${to}`,
    });
    const { errorMessage, errorCode } = message;
    // console.log(errorMessage);
    if (!errorMessage) {
      session.verifyCode = verifyCode;
      await session.save();
      console.log(session);
      res.status(200).json({
        code: 0,
        msg: '',
      });
    } else {
      res.status(200).json({
        code: errorCode,
        msg: errorMessage,
      });
    }
  } catch (err) {
    console.log(err);
  }

  // res.status(200).json({
  //   code: 0,
  //   data: 123,
  // });
}

export default withIronSessionApiRoute(sendVerifyCode, ironOptions);
