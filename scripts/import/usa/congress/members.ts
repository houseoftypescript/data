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
  const uniqueMembers = [];
  const uniqueMemberIds: string[] = [];
  for (let congress = 80; congress <= CURRENT_CONGRESS; congress++) {
    for (const chamber of CONGRESS_CHAMBERS) {
      const membersUrl = `${PROPUBLICA_CONGRESS_BASE_URL}/${congress}/${chamber}/members.json`;
      const response = await axios.get(membersUrl, {
        headers: { 'X-API-Key': API_KEY_PROPUBLICA_CONGRESS },
      });
      const results = response.data.results || [];
      const members: any[] = (results[0] || {}).members || [];
      console.log(congress, chamber, members.length);

      if (members.length > 0) {
        const folder = `./data/usa/congress/${congress}/${chamber}`;
        const exists: boolean = existsSync(folder);
        if (!exists) mkdirSync(folder, { recursive: true });
        const csvFile = `${folder}/members.csv`;
        writeFileCSV(csvFile, members);

        for (const member of members) {
          if (!uniqueMemberIds.includes(member.id)) {
            uniqueMemberIds.push(member.id);
            uniqueMembers.push({
              id: member.id,
              first_name: member.first_name,
              middle_name: member.middle_name,
              last_name: member.last_name,
              date_of_birth: member.date_of_birth,
              gender: member.gender,
              state: member.state,
              party: member.party,
            });
          }
        }

        uniqueMembers.sort((a, b) => (a.id > b.id ? 1 : -1));
        writeFileCSV(`./data/usa/congress/members.csv`, uniqueMembers);
      }
    }
  }

  process.exit(0);
};

main().catch((error) => console.error(error));
