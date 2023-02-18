import { readFileSync, writeFileSync } from 'fs';
import { csvToJSON } from '../../../libs/csv-to-json';
import { jsonToCSV } from '../../../libs/json-to-csv';

const main = async () => {
  try {
    const stockCSV: string = readFileSync(
      './data/vietnam/stock/stock.csv',
      'utf-8'
    );
    const symbols = csvToJSON(stockCSV);
    console.log(symbols);
    let allDates: string[] = [];
    for (const { symbol } of symbols) {
      console.log(symbol);
      const historyCSV: string = readFileSync(
        `./data/vietnam/stock/history/${symbol}.csv`,
        'utf-8'
      );
      const history = csvToJSON(historyCSV);
      const dates: string[] = history.map((item) => item.date);
      allDates = allDates.concat(dates);
    }
    allDates.sort();
    const uniqueDates = [...new Set(allDates)].map((date) => {
      return { date };
    });
    const datesCSV = jsonToCSV(uniqueDates, ['date']);
    writeFileSync(`./data/vietnam/stock/dates.csv`, datesCSV);
  } catch (error) {
    console.error((error as any).response.data);
  }
};

main().catch(console.error);
