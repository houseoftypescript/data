export const csvToJSON = (csv: string) => {
  if (csv === '') {
    return [];
  }
  const rows: string[] = csv
    .split('\n')
    .filter((row: string) => row.trim() !== '');
  const headers: string[] = rows[0].split(',');
  const data = rows.slice(1, rows.length);
  return data.map((row) => {
    const item: Record<string, string> = {};
    row.split('","').forEach((cell: string, index: number) => {
      item[headers[index]] = cell.replace('"', '');
    });
    return item;
  });
};
