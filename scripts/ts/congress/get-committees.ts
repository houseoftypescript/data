import axios from 'axios';
import {
  API_KEY_PROPUBLICA_CONGRESS,
  BASE_URL,
  CHAMBERS,
  CURRENT_CONGRESS,
} from './configs';
import { writeFileCSV } from './utils';

const main = async () => {
  for (let congress = CURRENT_CONGRESS; congress >= 80; congress--) {
    for (const chamber of CHAMBERS) {
      const committeesUrl = `${BASE_URL}/${congress}/${chamber}/committees.json`;
      const response = await axios.get(committeesUrl, {
        headers: { 'X-API-Key': API_KEY_PROPUBLICA_CONGRESS },
      });
      const results = response.data.results || [];
      const committees: any[] = (results[0] || {}).committees || [];
      console.log(congress, chamber, committees.length);

      if (committees.length > 0) {
        const csvFile = `./data/congress/${congress}/${chamber}/committees.csv`;
        writeFileCSV(csvFile, committees);
      }
    }
  }

  process.exit(0);
};

main().catch((error) => console.error(error));
