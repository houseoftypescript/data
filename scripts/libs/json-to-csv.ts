export const jsonToCSV = (data: any[], headers: string[]): string => {
  const csvHeader = headers.join(',');
  const csvRows = data
    .map((item) =>
      headers
        .map((header) => {
          const value = item[header];
          return `"${value}"`;
        })
        .join(',')
    )
    .join('\n');
  return `${csvHeader}\n${csvRows}\n`;
};
