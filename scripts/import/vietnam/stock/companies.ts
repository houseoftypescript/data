import axios from 'axios';
import { readFileSync, writeFileSync } from 'fs';
import { SSI_INFO_URL } from '../../../configs';
import { csvToJSON } from '../../../libs/csv-to-json';
import { jsonToCSV } from '../../../libs/json-to-csv';

const main = async () => {
  try {
    const symbolsCSV: string = readFileSync(
      './data/vietnam/stock/stock.csv',
      'utf-8'
    );
    const symbols = csvToJSON(symbolsCSV);
    console.log(symbols);
    const companies = [];
    for (const { symbol, market } of symbols) {
      const postData = JSON.stringify({
        query: `query company {
          profile: companyProfile(symbol: "${symbol}", language: "en") {
            symbol
            companyname
            industryname
            supersector
            sector
            subsector
            listingdate
            issueshare
            listedvalue
          }
          statistics: companyStatistics(symbol: "${symbol}") {
            marketcap
          }
        }`,
        variables: {},
      });
      const config = {
        method: 'POST',
        url: SSI_INFO_URL,
        headers: { 'Content-Type': 'application/json' },
        data: postData,
      };
      const response = await axios(config);
      const {
        data: { data },
      } = response;
      console.log(symbol, market);
      companies.push({
        symbol: data.profile.symbol,
        name: data.profile.companyname,
        industry: data.profile.industryname,
        supersector: data.profile.supersector,
        sector: data.profile.sector,
        subsector: data.profile.subsector,
        listingDate: data.profile.listingdate,
        issueShare: data.profile.issueshare,
        listedValue: data.profile.listedvalue,
        marketCap: data.statistics.marketcap,
      });
      companies.sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
      const companiesCSV = jsonToCSV(companies, [
        'symbol',
        'name',
        'industry',
        'supersector',
        'sector',
        'subsector',
        'listingDate',
        'issueShare',
        'listedValue',
        'marketCap',
      ]);
      writeFileSync('./data/vietnam/stock/companies.csv', companiesCSV);
    }
  } catch (error) {
    console.error((error as any).response.data);
  }
};

main().catch(console.error);
