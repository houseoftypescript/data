import axios from 'axios';
import { existsSync, mkdirSync } from 'fs';
import {
  API_KEY_PROPUBLICA_CONGRESS,
  CONGRESS_CHAMBERS,
  CURRENT_CONGRESS,
  PROPUBLICA_CONGRESS_BASE_URL,
} from '../../../configs';
import { writeFileCSV } from '../../../utils';

const main = async () => {
  for (let congress = CURRENT_CONGRESS; congress >= 80; congress--) {
    for (const chamber of CONGRESS_CHAMBERS) {
      const committeesUrl = `${PROPUBLICA_CONGRESS_BASE_URL}/${congress}/${chamber}/committees.json`;
      const response = await axios.get(committeesUrl, {
        headers: { 'X-API-Key': API_KEY_PROPUBLICA_CONGRESS },
      });
      const results = response.data.results || [];
      const committees: any[] = (results[0] || {}).committees || [];
      console.log(congress, chamber, committees.length);

      if (committees.length > 0) {
        const folder = `./data/usa/congress/${congress}/${chamber}`;
        const exists: boolean = existsSync(folder);
        if (!exists) mkdirSync(folder, { recursive: true });
        const csvFile = `${folder}/committees.csv`;
        writeFileCSV(csvFile, committees);
      }
    }
  }

  process.exit(0);
};

main().catch((error) => console.error(error));
