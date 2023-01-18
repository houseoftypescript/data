import {
  PrismaClient,
  Member,
  Chamber,
  Title,
  Party,
  Gender,
} from '@prisma/client';
import { readFileCSV } from '../utils';
import { CHAMBERS, CURRENT_CONGRESS } from '../configs';

const prismaClient = new PrismaClient();

const parties: Record<string, Party> = { D: 'DEMOCRATIC', R: 'REPUBLICAN' };

const migrateMembers = async (
  congress: number,
  chamber: string,
  membersCSV: any[]
) => {
  for (const memberCSV of membersCSV) {
    try {
      const memberId: string = memberCSV.id;
      console.log(congress, chamber, memberId);
      let member: Member | null = await prismaClient.member.findUnique({
        where: { id: memberId },
      });
      if (member === null) {
        const gender: Gender =
          memberCSV.gender.toUpperCase() === 'M' ? 'MALE' : 'FEMALE';
        const update = {
          firstName: memberCSV.first_name as string,
          middleName: memberCSV.middle_name as string,
          lastName: memberCSV.last_name as string,
          dateOfBirth: memberCSV.date_of_birth as string,
          gender,
        };
        const create = { ...update, id: memberId };
        member = await prismaClient.member.upsert({
          create: create,
          update: update,
          where: { id: memberId },
        });
      }
      const title = memberCSV.title.toLowerCase().includes('senator')
        ? 'senator'
        : memberCSV.title;
      const party: Party = parties[memberCSV.party] || 'INDEPENDENT';
      if (member !== null) {
        await prismaClient.congressMember.upsert({
          create: {
            congress,
            chamber: chamber.toUpperCase() as Chamber,
            title: title.toUpperCase().replaceAll(' ', '_') as Title,
            district: memberCSV.district || 'at-large',
            memberId: member.id,
            party,
            seniority: parseInt(memberCSV.seniority, 10) || 0,
            stateId: memberCSV.state.toUpperCase() as string,
          },
          update: {
            congress,
            chamber: chamber.toUpperCase() as Chamber,
            title: title.toUpperCase().replaceAll(' ', '_') as Title,
            district: memberCSV.district || 'at-large',
            memberId: member.id,
            party,
            seniority: parseInt(memberCSV.seniority, 10) || 0,
            stateId: memberCSV.state.toUpperCase() as string,
          },
          where: { congress_memberId: { congress, memberId } },
        });
      }
    } catch (error) {
      console.error('migrateMembers Error', error);
    }
  }
};

const main = async () => {
  await prismaClient.$connect();

  for (let congress = 80; congress <= CURRENT_CONGRESS; congress++) {
    for (const chamber of CHAMBERS) {
      const membersCSV = await readFileCSV(
        `./data/congress/${congress}/${chamber}/members.csv`
      );
      console.log(membersCSV.length);

      await migrateMembers(congress, chamber, membersCSV);
    }
  }

  process.exit(0);
};

main().catch(console.error);
