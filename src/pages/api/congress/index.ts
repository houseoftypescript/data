import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  congress: number[];
};

const handler = (_request: NextApiRequest, response: NextApiResponse<Data>) => {
  const congress: number[] = Array.from({ length: 118 - 80 + 1 }).map(
    (_, index: number) => index + 80
  );
  response.status(200).json({ congress });
};

export default handler;
