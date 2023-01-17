import axios from 'axios';
import {
  API_KEY_PROPUBLICA_CONGRESS,
  BASE_URL,
  CHAMBERS,
  CURRENT_CONGRESS,
} from './configs';
import { writeFileCSV } from './utils';

const main = async () => {
  for (let congress = 80; congress <= CURRENT_CONGRESS; congress++) {
    for (const chamber of CHAMBERS) {
      const membersUrl = `${BASE_URL}/${congress}/${chamber}/members.json`;
      const response = await axios.get(membersUrl, {
        headers: { 'X-API-Key': API_KEY_PROPUBLICA_CONGRESS },
      });
      const results = response.data.results || [];
      const members: any[] = (results[0] || {}).members || [];
      console.log(members.length);

      if (members.length > 0) {
        const csvFile = `./data/congress/${congress}/${chamber}/members.csv`;
        writeFileCSV(csvFile, members);
      }
    }
  }

  process.exit(0);
};

main().catch((error) => console.error(error));
