import axios from 'axios';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { SSI_HISTORY_URL } from '../../../configs';
import { csvToJSON } from '../../../libs/csv-to-json';
import { jsonToCSV } from '../../../libs/json-to-csv';

type HistoryItem = {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  date: string;
  volume: number;
  year: string;
  month: string;
  week: number;
  weekday: string;
};

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const getWeek = (timestamp: number) => {
  const d = new Date(timestamp);
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(d.getUTCFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

const main = async () => {
  try {
    const folder = `./data/vietnam/stock/history`;
    const exists: boolean = existsSync(folder);
    if (!exists) mkdirSync(folder, { recursive: true });
    const stockCSV: string =
      readFileSync('./data/vietnam/stock/stock.csv', 'utf-8') || '';
    const symbols = csvToJSON<{ symbol: string }>(stockCSV);
    console.log(symbols);
    for (const { symbol } of symbols) {
      let oldHistoryCSV = '';
      try {
        oldHistoryCSV = readFileSync(`${folder}/${symbol}.csv`, 'utf-8');
      } catch (error) {
        console.error(error);
      }
      const oldHistory = csvToJSON<HistoryItem>(oldHistoryCSV);
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
      const newHistory: HistoryItem[] = data.t.map(
        (timestamp: number, index: number) => {
          const open = parseFloat(data.o[index]);
          const high = parseFloat(data.h[index]);
          const low = parseFloat(data.l[index]);
          const close = parseFloat(data.c[index]);
          const volume = parseFloat(data.v[index]);
          const d = new Date(timestamp * 1000);
          const [date] = d.toISOString().split('T');
          const [year, month] = date.split('-');
          const week: number = getWeek(timestamp * 1000);
          const weekday: string = weekdays[d.getDay()];
          console.log({ year, month, week, weekday });
          return {
            symbol,
            date,
            open,
            high,
            low,
            close,
            volume,
            year,
            month,
            week,
            weekday,
          };
        }
      );
      const history: HistoryItem[] = oldHistory
        .concat(newHistory)
        .filter((item) => item.weekday !== 'undefined');
      history.sort((a, b) => (a.date > b.date ? 1 : -1));
      const uniqueHistory: HistoryItem[] = [
        ...new Map(
          history.map((item: HistoryItem) => [item.date, item])
        ).values(),
      ];
      const historyCSV = jsonToCSV(uniqueHistory, [
        'symbol',
        'date',
        'open',
        'high',
        'low',
        'close',
        'volume',
        'year',
        'month',
        'week',
        'weekday',
      ]);
      writeFileSync(`${folder}/${symbol}.csv`, historyCSV);
    }
  } catch (error) {
    console.error(error);
  }
};

main().catch(console.error);
