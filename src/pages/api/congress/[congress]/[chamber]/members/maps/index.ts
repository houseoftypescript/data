import { Chamber, CongressMember } from '@prisma/client';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prismaClient } from '../../../../../../../libs/prisma';

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<string>
) => {
  if (request.method === 'GET') {
    await prismaClient.$connect();
    const congress = request.query.congress as string;
    const chamber = (
      (request.query.chamber as string) || ''
    ).toUpperCase() as Chamber;
    const url =
      'https://raw.githubusercontent.com/houseofmystery/usa/master/images/svg/usa.svg';
    let { data: svg } = await axios.get<string>(url);
    const members = await prismaClient.congressMember.findMany({
      include: { member: true, state: true },
      where: { congress: parseInt(congress), chamber },
    });
    const stateIds: string[] = members.map((member) => member.stateId);
    for (const stateId of stateIds) {
      const membersByStates = members.filter(
        (member: CongressMember) => member.stateId === stateId
      );
      const total = membersByStates.length;
      const democraticMembers = membersByStates.filter(
        (member) => member.party === 'DEMOCRATIC'
      );
      const republicanMembers = membersByStates.filter(
        (member) => member.party === 'REPUBLICAN'
      );
      if (democraticMembers.length === republicanMembers.length) {
        svg = svg.replace(
          `fill="FILL-${stateId}"`,
          `fill="rgb(255, 0, 255)" fill-opacity="0.5"`
        );
      } else if (democraticMembers.length < republicanMembers.length) {
        const republicanPercentage = republicanMembers.length / total;
        svg = svg.replace(
          `fill="FILL-${stateId}"`,
          `fill="rgb(255, 0, 0)" fill-opacity="${republicanPercentage}"`
        );
      } else if (democraticMembers.length > republicanMembers.length) {
        const democraticPercentage = democraticMembers.length / total;
        svg = svg.replace(
          `fill="FILL-${stateId}"`,
          `fill="rgb(0, 0, 255)" fill-opacity="${democraticPercentage}"`
        );
      }
    }
    await prismaClient.$disconnect();
    response.status(200).send(svg);
  } else {
    response.status(405);
  }
};

export default handler;
