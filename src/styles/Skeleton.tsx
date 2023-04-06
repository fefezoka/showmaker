import React from 'react';
import { keyframes, CSS } from '../../stitches.config';
import { Box } from './Box';
import { Flex } from './Flex';

const Glow = keyframes({
  '0%, 100%': {
    backgroundColor: '$skeleton',
  },
  '50%': {
    backgroundColor: '$skeletonalt',
  },
});

export const Line = ({ rows, css }: { rows?: number; css: CSS }) => {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <Box
          key={index}
          css={{
            animation: `${Glow} 1.2s ease-out 0s infinite normal`,
            br: '$2',
            ...(rows && rows > 1 && { mb: '$2' }),
            ...css,
          }}
        />
      ))}
    </>
  );
};

export const Circle = ({ css }: { css: CSS }) => {
  return (
    <Box
      css={{
        br: '$round',
        animation: `${Glow} 1.2s ease-out 0s infinite normal`,
        fs: 0,
        ...css,
      }}
    />
  );
};

export const Rectangle = ({ css }: { css: CSS }) => {
  return (
    <Box
      css={{
        animation: `${Glow} 1.2s ease-out 0s infinite normal`,
        br: '$1',
        fs: 0,
        ...css,
      }}
    />
  );
};

export const PostSkeleton = () => {
  return (
    <Box css={{ p: '$6', borderBottom: '2px solid $bgalt' }}>
      <Flex align={'center'} justify={'between'}>
        <Flex align={'center'} gap={'2'}>
          <Circle css={{ size: 32 }} />
          <Line css={{ height: 24, width: 120 }} />
        </Flex>
        <Line css={{ height: 24, width: 60 }} />
      </Flex>
      <Flex css={{ mt: '$2' }} justify={'between'} gap={'3'}>
        <Line css={{ height: 24, width: 240 }} />
        <Line css={{ height: 24, width: 120 }} />
      </Flex>
      <Box css={{ mt: '$4' }}>
        <Rectangle css={{ height: 200, br: '$6', '@bp2': { height: 320 } }} />
      </Box>
      <Flex align={'center'} justify={'center'} css={{ mt: '$3' }} gap={'4'}>
        <Circle css={{ size: 40 }} />
        <Line css={{ height: 40, width: '100%' }} />
        <Rectangle css={{ height: 40, width: 88 }} />
      </Flex>
    </Box>
  );
};

export const ProfileSkeleton = () => {
  return (
    <Box css={{ p: '$6', pb: 0 }}>
      <Flex gap={'4'} css={{ mb: '$6' }} align={'center'}>
        <Circle css={{ size: 84, '@bp2': { size: 144 } }} />
        <Line css={{ height: 24, width: 192 }} />
      </Flex>
      <Line rows={2} css={{ height: 16, width: 200 }} />
      <Flex css={{ mt: '$4' }} justify={'center'} gap={'4'}>
        <Rectangle css={{ height: 40, width: 120 }} />
        <Rectangle css={{ height: 40, width: 120 }} />
      </Flex>
    </Box>
  );
};
