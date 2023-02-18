import { readFileSync, writeFileSync } from 'fs';
import { csvToJSON } from '../libs/csv-to-json';
import { jsonToCSV } from '../libs/json-to-csv';

const getTradingDatesPercentage = (
  firstDate: string,
  latestDate: string,
  historyDates: string[],
  allDates: string[]
): number => {
  if (firstDate === '' || latestDate === '' || historyDates.length === 0) {
    return 0;
  }
  const allFirstIndex: number = allDates.findIndex((d) => d === firstDate);
  const allLastIndex: number = allDates.findIndex((d) => d === latestDate);
  const allDiff: number = allLastIndex - allFirstIndex;
  const historyFirstIndex: number = historyDates.findIndex(
    (d) => d === firstDate
  );
  const historyLastIndex: number = historyDates.findIndex(
    (d) => d === latestDate
  );
  const historyDiff: number = historyLastIndex - historyFirstIndex;
  return parseFloat(((historyDiff / allDiff) * 100).toFixed(2));
};

const main = async () => {
  // Dates
  const datesCSV: string = readFileSync('./data/dates.csv', 'utf-8');
  const dates: string[] = csvToJSON(datesCSV).map(
    ({ date }: Record<string, string>) => date
  );
  const upToDate = dates[dates.length - 1];
  console.log(upToDate);
  // Symbols
  const symbolsCSV: string = readFileSync('./data/stock.csv', 'utf-8');
  const symbols = csvToJSON(symbolsCSV);
  // Companies
  const companiesCSV: string = readFileSync('./data/companies.csv', 'utf-8');
  const companies = csvToJSON(companiesCSV);
  // Attributes
  const attributes: Record<string, any> = {};
  for (const { symbol } of symbols) {
    attributes[symbol] = {};
    console.log(symbol);
    const company =
      companies.find((company) => company.symbol === symbol) || {};
    const historyFilePath = `./data/history/${symbol}.csv`;
    const historyCSV: string = readFileSync(historyFilePath, 'utf-8');
    const history = csvToJSON(historyCSV);
    const historyDates: string[] = history.map((item) => item.date);
    // First
    const firstHistory = history[0] || {};
    const firstDate = firstHistory.date || '';
    // Latest
    const latestHistory = history[history.length - 1] || {};
    const latestDate = latestHistory.date || '';
    // Up To Date
    const upToDateHistory = history.find((item) => item.date === upToDate);
    if (upToDateHistory) {
      attributes[symbol].upToDate = 1;
    } else {
      attributes[symbol].upToDate = -1;
    }
    attributes[symbol].marketCap = parseFloat(company.marketCap || '0');
    attributes[symbol].name = company.name;
    attributes[symbol].listingDate = company.listingDate;
    attributes[symbol].close = parseFloat(latestHistory.close || '0');
    attributes[symbol].volume = parseFloat(latestHistory.volume || '0');
    attributes[symbol].tradingDates = getTradingDatesPercentage(
      firstDate,
      latestDate,
      historyDates,
      dates
    );
  }
  console.log(attributes);
  const rankings = Object.keys(attributes).map((stock) => {
    const stockAttributes = attributes[stock];
    return { ...stockAttributes, stock };
  });
  rankings.sort((a, b) => {
    if (a.upToDate === b.upToDate) {
      if (a.tradingDates === b.tradingDates) {
        return a.stock > b.stock ? 1 : -1;
      }
      return a.tradingDates < b.tradingDates ? 1 : -1;
    }
    return a.upToDate < b.upToDate ? 1 : -1;
  });
  const rankingsCSV = jsonToCSV(rankings, [
    'stock',
    'name',
    'close',
    'volume',
    'marketCap',
    'listingDate',
    'tradingDates',
    'upToDate',
  ]);
  writeFileSync('./data/rankings.csv', rankingsCSV);
};

main().catch(console.error);
