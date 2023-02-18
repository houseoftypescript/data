import { readFileSync } from 'fs';
import { csvToJSON } from '../libs/csv-to-json';
import { prismaClient } from '../../../src/libs/prisma';
import { Market } from '@prisma/client';

const main = async () => {
  const stockCSV: string = readFileSync('./data/stock.csv', 'utf-8');
  const stock = csvToJSON(stockCSV);
  await prismaClient.$connect();
  for (const { symbol, market } of stock) {
    await prismaClient.stock.upsert({
      create: {
        symbol,
        market: market as Market,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      update: {
        symbol,
        market: market as Market,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      where: { symbol },
    });
  }
  await prismaClient.$disconnect();
};

main().catch(console.error);
