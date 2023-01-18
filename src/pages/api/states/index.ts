import { State } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prismaClient } from '../../../libs/prisma';

type Data = {
  states: State[];
};

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<Data>
) => {
  if (request.method === 'GET') {
    await prismaClient.$connect();
    const states = await prismaClient.state.findMany();
    await prismaClient.$disconnect();
    response.status(200).json({ states });
  } else {
    response.status(405);
  }
};

export default handler;
