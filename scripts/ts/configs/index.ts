export const BASE_URL: string = 'https://api.propublica.org/congress/v1';
export const CHAMBERS: string[] = ['house', 'senate'];
export const CURRENT_CONGRESS: number = 118;
export const API_KEY_PROPUBLICA_CONGRESS: string =
  process.env.API_KEY_PROPUBLICA_CONGRESS || '';
