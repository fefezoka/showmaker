import { globalCss } from 'stitches.config';

import { Raleway } from 'next/font/google';

const raleway = Raleway({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});

export const global = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: raleway.style.fontFamily,
  },

  body: {
    backgroundColor: '$bg1',
    color: '$text-primary',
  },

  a: {
    all: 'unset',
    cursor: 'pointer',
  },

  fieldset: {
    border: 'none',
  },

  button: {
    all: 'unset',
    cursor: 'pointer',
  },

  li: {
    listStyle: 'none',
  },

  input: {
    border: 'none',
  },

  'input:focus': {
    outline: 'none',
  },

  '::-webkit-scrollbar': {
    width: '1rem',
  },

  '::-webkit-scrollbar-track': {
    backgroundColor: '$bg2',
  },

  '::-webkit-scrollbar-thumb': {
    backgroundColor: '$bg3',
  },
});
