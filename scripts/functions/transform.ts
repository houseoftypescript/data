import { readFileSync, writeFileSync } from 'fs';
import { csvToJSON } from '../libs/csv-to-json';
import { jsonToCSV } from '../libs/json-to-csv';

const main = async () => {
  // Symbols
  const stockCSV: string = readFileSync('./data/stock.csv', 'utf-8');
  const stock = csvToJSON(stockCSV);
  for (const { symbol } of stock) {
    console.log(symbol);
    const historyFilePath = `./data/history/${symbol}.csv`;
    const historyCSV: string = readFileSync(historyFilePath, 'utf-8');
    const history = csvToJSON(historyCSV);
    let lastStreak = 0;
    const transformedHistory = history
      .map(
        (
          item: Record<string, string>,
          index: number,
          array: Record<string, string>[]
        ) => {
          if (index === 0) {
            return { ...item, status: 'START' };
          }
          const past = parseFloat(array[index - 1].close);
          const close = parseFloat(item.close);
          const status =
            past === close ? 'STAY' : past > close ? 'BULL' : 'BULK';
          return { ...item, status };
        }
      )
      .map(
        (
          item: Record<string, string>,
          index: number,
          array: Record<string, string>[]
        ) => {
          if (index === 0) {
            lastStreak = 0;
            return { ...item, streak: 0 };
          }
          const lastStatus = array[index - 1].status;
          const status = item.status;
          if (status === 'BULK') {
            if (lastStatus === 'BULK') {
              lastStreak += 1;
            } else if (lastStatus === 'BULL') {
              lastStreak = 0;
            }
            return { ...item, streak: lastStreak };
          } else if (status === 'STAY') {
            if (lastStatus === 'BULK') {
              lastStreak = 0;
            } else if (lastStatus === 'BULL') {
              lastStreak = 0;
            }
            return { ...item, streak: lastStreak };
          } else if (status === 'BULL') {
            if (lastStatus === 'BULK') {
              lastStreak = 0;
            } else if (lastStatus === 'BULL') {
              lastStreak -= 1;
            }
            return { ...item, streak: lastStreak };
          }
          return { ...item, streak: 'N/A' };
        }
      );
    const transformedHistoryCSV = jsonToCSV(transformedHistory, [
      'symbol',
      'date',
      'open',
      'high',
      'low',
      'close',
      'volume',
      'status',
      'streak',
    ]);
    writeFileSync(
      `./data/transform/history/${symbol}.csv`,
      transformedHistoryCSV
    );
    console.log(history);
  }
};

main().catch(console.error);
