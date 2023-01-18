import type { NextApiRequest, NextApiResponse } from 'next';
import { CHAMBERS } from '../../../../configs';

type Data = {
  chambers: string[];
};

const handler = (_request: NextApiRequest, response: NextApiResponse<Data>) => {
  response.status(200).json({ chambers: CHAMBERS });
};

export default handler;
