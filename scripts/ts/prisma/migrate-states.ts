import { PrismaClient, State } from '@prisma/client';
import { readFileCSV } from '../utils';

const prismaClient = new PrismaClient();

const main = async () => {
  const statesCSV = await readFileCSV('./data/states.csv');
  await prismaClient.$connect();
  const states: State[] = statesCSV.map((state) => {
    return {
      id: state.abbreviation,
      name: state.name,
      capital: state.capital,
      largest: state.largest,
      level: state.level.toUpperCase(),
    };
  });
  await prismaClient.state.createMany({ data: states });
};

main().catch(console.error);
