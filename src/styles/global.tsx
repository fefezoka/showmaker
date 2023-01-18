import { globalCss } from '../../stitches.config';

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
    backgroundColor: '$bgalt',
  },

  '::-webkit-scrollbar-thumb': {
    backgroundColor: '$scrollthumb',
  },

  '.balloon': {
    width: '10vmax',
    height: '10vmax',
    borderRadius: '100% 100% 15% 100%',
    margin: '0 0 0 25px',
    transform: 'rotateZ(45deg)',
    position: 'fixed',
    bottom: 'calc(-1 * 10vmax)',
    left: '10%',
    backgroundColor: 'aqua',
    zIndex: '$modal',
  },

  '&::before': {
    content: '',
    width: '10%',
    height: '25%',
    background:
      'radial-gradient(circle, rgba(255,255,255,.7) 0%, rgba(255,255,255,.1) 100%)',
    position: 'absolute',
    left: '15%',
    top: '45%',
    borderRadius: '100%',
  },

  '&::after': {
    content: '',
    width: '13%',
    height: '5%',
    backgroundColor: 'inherit',
    position: 'absolute',
    left: '90%',
    top: '94%',
    borderRadius: '22%',
    transform: 'rotateZ(-45deg)',
  },

  '.string': {
    position: 'absolute',
    backgroundColor: '#990',
    width: '2px',
    height: 'calc(10vmax * .6)',
    transformOrigin: 'top center',
    transform: 'rotateZ(-45deg)',
    top: 'calc(10vmax - 6px)',
    left: 'calc(10vmax - 8px)',
  },

  '.yellow': {
    backgroundColor: 'rgba(150, 150, 0, .45)',
  },

  '.green': {
    backgroundColor: 'rgba(0, 150, 0, .45)',
  },

  '.blue': {
    backgroundColor: 'rgba(0, 0, 150, .45)',
  },
  '.red': {
    backgroundColor: 'rgba(150, 0, 0, .45)',
  },
});
