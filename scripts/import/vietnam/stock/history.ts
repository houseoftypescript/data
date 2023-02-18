import axios from 'axios';
import { readFileSync, writeFileSync } from 'fs';
import { SSI_HISTORY_URL } from '../../../configs';
import { csvToJSON } from '../../../libs/csv-to-json';
import { jsonToCSV } from '../../../libs/json-to-csv';

const main = async () => {
  try {
    const stockCSV: string =
      readFileSync('./data/vietnam/stock/stock.csv', 'utf-8') || '';
    const symbols = csvToJSON(stockCSV);
    console.log(symbols);
    for (const { symbol } of symbols) {
      let oldHistoryCSV = '';
      try {
        oldHistoryCSV = readFileSync(
          `./data/vietnam/stock/history/${symbol}.csv`,
          'utf-8'
        );
      } catch (error) {
        console.error(error);
      }
      const oldHistory = csvToJSON(oldHistoryCSV);
      const to = Math.floor(new Date().getTime() / 1000);
      const url = `${SSI_HISTORY_URL}?resolution=D&symbol=${symbol}&from=0&to=${to}`;
      console.log(url);
      const config = {
        method: 'get',
        url,
        headers: { 'Content-Type': 'application/json' },
      };
      const response = await axios(config);
      const { data } = response;
      console.log(symbol, data);
      const newHistory: any[] = data.t.map(
        (timestamp: number, index: number) => {
          const open = parseFloat(data.o[index]);
          const high = parseFloat(data.h[index]);
          const low = parseFloat(data.l[index]);
          const close = parseFloat(data.c[index]);
          const volume = parseFloat(data.v[index]);
          const [date] = new Date(timestamp * 1000).toISOString().split('T');
          return { symbol, open, high, low, close, date, volume };
        }
      );
      const history = oldHistory.concat(newHistory);
      history.sort((a, b) => (a.date > b.date ? 1 : -1));
      const uniqueHistory = [
        ...new Map(history.map((item) => [item.date, item])).values(),
      ];
      const historyCSV = jsonToCSV(uniqueHistory, [
        'symbol',
        'date',
        'open',
        'high',
        'low',
        'close',
        'volume',
      ]);
      writeFileSync(`./data/vietnam/stock/history/${symbol}.csv`, historyCSV);
    }
  } catch (error) {
    console.error(error);
  }
};

main().catch(console.error);
