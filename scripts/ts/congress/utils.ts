import { writeFileSync } from 'fs';
import { parse } from 'json2csv';

export const writeFileCSV = (csvFile: string, data: any[]) => {
  const fields: string[] = [];
  for (const item of data) {
    const keys = Object.keys(item);
    for (const key of keys) {
      const value = item[key];
      const valueType:
        | 'string'
        | 'number'
        | 'bigint'
        | 'boolean'
        | 'symbol'
        | 'undefined'
        | 'object'
        | 'function' = typeof value;
      if (
        !fields.includes(key) &&
        valueType !== 'undefined' &&
        valueType !== 'object' &&
        valueType !== 'function'
      ) {
        fields.push(key);
      }
    }
  }

  try {
    const csv = parse(data, { fields });
    writeFileSync(csvFile, csv);
  } catch (err) {
    console.error(err);
  }
};
