import React from 'react';
import { Text } from './Text';
import { VariantProps, CSS } from '../../stitches.config';
import merge from 'lodash.merge';

const DEFAULT_TAG = 'h1';

type TextSizeVariants = Pick<VariantProps<typeof Text>, 'size'>;
type HeadingSizeVariants = '1' | '2' | '3';
type HeadingVariants = { size?: HeadingSizeVariants } & Omit<
  VariantProps<typeof Text>,
  'size'
>;
type HeadingProps = React.ComponentProps<typeof DEFAULT_TAG> &
  HeadingVariants & { css?: CSS; as?: any };

export const Heading = React.forwardRef<
  React.ElementRef<typeof DEFAULT_TAG>,
  HeadingProps
>((props, forwardedRef) => {
  const { size = '1', ...textProps } = props;
  const textSize: Record<HeadingSizeVariants, TextSizeVariants['size']> = {
    1: { '@initial': '5', '@bp2': '6' },
    2: { '@initial': '6', '@bp2': '7' },
    3: { '@initial': '7', '@bp2': '8' },
  };

  const textCss: Record<HeadingSizeVariants, CSS> = {
    1: { fontWeight: 600, lineHeight: '18px', '@bp2': { lineHeight: '26px' } },
    2: { fontWeight: 600, lineHeight: '20px', '@bp2': { lineHeight: '32px' } },
    3: { fontWeight: 600, lineHeight: '25px', '@bp2': { lineHeight: '42px' } },
  };

  return (
    <Text
      as={DEFAULT_TAG}
      {...textProps}
      ref={forwardedRef}
      size={textSize[size]}
      css={{
        fontVariantNumeric: 'proportional-nums',
        ...merge(textCss[size], props.css),
      }}
    />
  );
});

Heading.displayName = 'Heading';
