import { Chamber, CongressMember } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prismaClient } from '../../../../../../libs/prisma';

type Data = {
  members: CongressMember[];
};

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<Data>
) => {
  if (request.method === 'GET') {
    await prismaClient.$connect();
    const congress = request.query.congress as string;
    const chamber = (
      (request.query.chamber as string) || ''
    ).toUpperCase() as Chamber;
    const members = await prismaClient.congressMember.findMany({
      include: { member: true, state: true },
      where: { congress: parseInt(congress), chamber },
    });
    await prismaClient.$disconnect();
    response.status(200).json({ members });
  } else {
    response.status(405);
  }
};

export default handler;
