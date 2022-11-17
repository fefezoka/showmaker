export const diffBetweenDates = (date1: Date, date2: Date) => {
  const diff = Math.ceil((date1.getTime() - date2.getTime()) / (1000 * 60));

  if (diff < 60) {
    return `${diff.toFixed(0)}m atrás`;
  }
  if (diff < 1440) {
    return `${(diff / 60).toFixed(0)}h atrás`;
  }
  return `${Math.floor(diff / 1440)} dia${diff / 1440 > 2 ? 's' : ''} atrás`;
};
