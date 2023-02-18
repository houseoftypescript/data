import { readFileSync } from 'fs';
import { prismaClient } from '../../../src/libs/prisma';
import { csvToJSON } from '../libs/csv-to-json';

const main = async () => {
  const stockCSV: string = readFileSync('./data/stock.csv', 'utf-8');
  const stock = csvToJSON(stockCSV);
  stock.reverse();
  await prismaClient.$connect();
  for (const { symbol } of stock) {
    const historyCSV: string = readFileSync(
      `./data/history/${symbol}.csv`,
      'utf-8'
    );
    const history = csvToJSON(historyCSV);
    for (const { symbol, date, open, high, low, close, volume } of history) {
      console.log(symbol);
      await prismaClient.history.upsert({
        create: {
          symbol,
          date,
          time: new Date(date),
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
          volume: parseInt(volume, 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        update: {
          symbol,
          date,
          time: new Date(date),
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
          volume: parseInt(volume, 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        where: { symbol_date: { symbol, date } },
      });
    }
  }
  await prismaClient.$disconnect();
};

main().catch(console.error);
