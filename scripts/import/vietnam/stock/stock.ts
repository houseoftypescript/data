import axios from 'axios';
import { writeFileSync } from 'fs';
import { SSI_GATEWAY_URL } from '../../../configs';
import { jsonToCSV } from '../../../libs/json-to-csv';

const query = `query getStocks {
    hose: stockRealtimes(exchange: "hose") {
      stockSymbol
    }
    hnx: stockRealtimes(exchange: "hnx") {
      stockSymbol
    }
    upcom: stockRealtimes(exchange: "upcom") {
      stockSymbol
    }
}`;

const main = async () => {
  try {
    const postData = JSON.stringify({
      query: `query getStock {
        hose: stockRealtimes(exchange: "hose") {
          stockSymbol
        }
        hnx: stockRealtimes(exchange: "hnx") {
          stockSymbol
        }
        upcom: stockRealtimes(exchange: "upcom") {
          stockSymbol
        }
    }`,
      variables: {},
    });

    const config = {
      method: 'post',
      url: SSI_GATEWAY_URL,
      headers: { 'Content-Type': 'application/json' },
      data: postData,
    };

    const response = await axios(config);
    const {
      data: { data },
    } = response;
    const markets = Object.keys(data);
    const symbols = markets
      .map((market) => {
        const symbols = data[market]
          .map(({ stockSymbol }: { stockSymbol: string }) => stockSymbol)
          .map((symbol: string) => {
            return { symbol, market: market.toUpperCase() };
          });
        return symbols;
      })
      .flat(1)
      .filter(({ symbol }) => symbol.length === 3)
      .sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
    const csv = jsonToCSV(symbols, ['symbol', 'market']);
    writeFileSync('./data/vietnam/stock/stock.csv', csv);
    console.log(symbols);
  } catch (error) {
    console.error((error as any).response.data);
  }
};

main().catch(console.error);
