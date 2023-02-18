export const diffBetweenDates = (date: Date | number) => {
  const timeMs = typeof date === 'number' ? date : date.getTime();
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
  const cutoffs = [60, 3600, 86400, 86400 * 30, 86400 * 365, Infinity];
  const units: Intl.RelativeTimeFormatUnit[] = [
    'second',
    'minute',
    'hour',
    'day',
    'month',
    'year',
  ];
  const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

  return rtf.format(Math.ceil(deltaSeconds / divisor), units[unitIndex]);
};
