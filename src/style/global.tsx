import { globalCss } from './stitches.config';

import { Raleway } from '@next/font/google';

const raleway = Raleway({
  weight: '400',
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
    backgroundColor: '$bg',
    color: '$white',
  },

  a: {
    cursor: 'pointer',
    textDecoration: 'none',
    color: '$white',
  },

  fieldset: {
    border: 'none',
  },

  button: {
    backgroundColor: 'unset',
    border: 'none',
    color: '$white',
    fontSize: '1rem',
  },

  li: {
    listStyle: 'none',
  },

  'h1, h2, h3': {
    lineHeight: '2.25rem',
  },

  h3: {
    fontSize: '20px',
  },
});
