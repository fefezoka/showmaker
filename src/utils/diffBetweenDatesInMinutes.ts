import React from 'react';

export const diffBetweenDatesInMinutes = (date1: Date, date2: Date) => {
  const diff = (date1.getTime() - date2.getTime()) / (1000 * 60);

  return Math.abs(Math.round(diff));
};
