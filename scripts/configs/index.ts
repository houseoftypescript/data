import dotenv from 'dotenv';
dotenv.config();

export const PROPUBLICA_CONGRESS_BASE_URL =
  'https://api.propublica.org/congress/v1';
export const CONGRESS_CHAMBERS: string[] = ['house', 'senate'];
export const CURRENT_CONGRESS = 118;

export const API_KEY_PROPUBLICA_CONGRESS: string =
  process.env.API_KEY_PROPUBLICA_CONGRESS || '';

export const SSI_GATEWAY_URL = 'https://wgateway-iboard.ssi.com.vn/graphql';
export const SSI_HISTORY_URL = 'https://iboard.ssi.com.vn/dchart/api/history';
export const SSI_INFO_URL = 'https://finfo-iboard.ssi.com.vn/graphql';
