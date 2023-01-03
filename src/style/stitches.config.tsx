import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      bg: 'rgb(30, 42, 56)',
      bgalt: 'rgb(56, 64, 77)',
      scrollthumb: 'rgb(72, 84, 102)',
      black: 'rgb(20, 25, 32)',
      gray: 'rgb(169, 172, 182)',
      'input-gray': 'rgb(192, 196, 199)',
      white: 'rgb(232, 240, 249)',
      red: '#ff5050',
      redalt: '#e84d4d',
      blue: '#5892fc',
      bluealt: '#497ede',
      modal: 'rgb(250, 251, 253)',
      overlay: 'rgb(0, 0, 0, .4)',
    },
    fontSizes: {
      1: '0.625rem',
      2: '0.72rem',
      3: '0.875rem',
      4: '1rem',
      5: '1.125rem',
      6: '1.25rem',
      7: '1.5rem',
      8: '1.75rem',
    },
    zIndices: {
      header: 9,
      menu: 99,
      overlay: 999,
      modal: 9999,
    },
  },
  media: {
    dsk1: '(min-width: 560px)',
    dsk2: '(min-width: 768px)',
  },
});
