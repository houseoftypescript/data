import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  details: string[];
};

const handler = (_request: NextApiRequest, response: NextApiResponse<Data>) => {
  response.status(200).json({ details: ['members', 'committees'] });
};

export default handler;
