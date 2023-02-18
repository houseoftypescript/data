import { readFileSync } from 'fs';
import { csvToJSON } from '../libs/csv-to-json';
import { prismaClient } from '../../../src/libs/prisma';
import { Market } from '@prisma/client';

const main = async () => {
  const companiesCSV: string = readFileSync('./data/companies.csv', 'utf-8');
  const companies = csvToJSON(companiesCSV);
  await prismaClient.$connect();
  for (const {
    symbol = '',
    name = '',
    industry = '',
    supersector = '',
    sector = '',
    subsector = '',
    listingDate = '',
    issueShare = '0',
    listedValue = '0',
    marketCap = '0',
  } of companies) {
    const [date, time] = listingDate.split(' ');
    const [day, month, year] = date.split('/');
    const listingDateString = `${year}-${month}-${day}T${time}.000Z`;
    console.log(listingDateString);
    console.log(new Date(listingDateString));
    await prismaClient.company.upsert({
      create: {
        symbol,
        name,
        industry,
        supersector,
        sector,
        subsector,
        issueShare: parseInt(issueShare || '0', 10),
        listedValue: parseFloat(listedValue || '0'),
        marketCap: parseFloat(marketCap || '0'),
        listingDate: new Date(listingDateString),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      update: {
        symbol,
        name,
        industry,
        supersector,
        sector,
        subsector,
        issueShare: parseInt(issueShare || '0', 10),
        listedValue: parseFloat(listedValue || '0'),
        marketCap: parseFloat(marketCap || '0'),
        listingDate: new Date(listingDateString),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      where: { symbol },
    });
  }
  await prismaClient.$disconnect();
};

main().catch(console.error);
