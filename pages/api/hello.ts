// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { mock, Random } from 'mockjs';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
type Data = {
  name: string,
};

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  console.log(req,'session');
  res.status(200).json(
    mock({
      // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
      'list|1-10': [
        {
          // 属性 id 是一个自增数，起始值为 1，每次增 1
          'id|+1': 1,
          'name|1': [Random.cname(), Random.cname()],
          birthday: Random.date('yyyy-MM-dd'),
          address: Random.county(true),
        },
      ],
    })
  );
}
export default withIronSessionApiRoute(handler, ironOptions);
