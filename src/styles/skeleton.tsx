import React from 'react';
import { useSession } from 'next-auth/react';
import { keyframes, CSS } from 'stitches.config';
import { Box } from '@/styles/box';
import { Flex } from '@/styles/flex';

const Glow = keyframes({
  '0%, 100%': {
    backgroundColor: '$bg3',
  },
  '50%': {
    backgroundColor: '$bg4',
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
  const { data: session } = useSession();

  return (
    <Box css={{ p: '$4', '@bp2': { p: '$6' }, borderBottom: '2px solid $bg2' }}>
      <Flex align={'center'} justify={'between'}>
        <Flex align={'center'} gap={'2'}>
          <Circle css={{ size: 32 }} />
          <Line css={{ height: 22, width: 180 }} />
        </Flex>
        <Line css={{ height: 22, width: 80 }} />
      </Flex>
      <Line css={{ height: 22, width: 240, mt: '$1' }} />
      <Box css={{ mt: '$3', '@bp2': { mt: '$4' } }}>
        <Rectangle css={{ pb: '56.25%', br: '$4' }} />
      </Box>
      {session && (
        <Flex
          align={'center'}
          justify={'center'}
          css={{ mt: '$2', '@bp2': { mt: '$4' } }}
          gap={{ '@initial': '2', '@bp2': '4' }}
        >
          <Circle css={{ size: 40 }} />
          <Line css={{ height: 40, width: '100%', br: '$pill' }} />
          <Rectangle css={{ height: 40, width: 88, br: '$pill' }} />
        </Flex>
      )}
    </Box>
  );
};

export const ProfileSkeleton = () => {
  return (
    <Box css={{ p: '$4', borderBottom: '2px solid $bg2', pb: 0 }}>
      <Flex gap={'4'} css={{ mb: '$4' }} align={'center'}>
        <Circle css={{ size: 84, '@bp2': { size: 144 } }} />
        <Line css={{ height: 24, width: 192 }} />
      </Flex>
      <Line rows={2} css={{ height: 16, width: 200 }} />
      <Flex css={{ mt: '$4' }} justify={'center'} gap={'4'}>
        <Flex css={{ height: 36, width: 110 }} align={'center'}>
          <Line css={{ height: 16, width: '100%' }} />
        </Flex>
        <Flex css={{ height: 36, width: 110 }} align={'center'}>
          <Line css={{ height: 16, width: '100%' }} />
        </Flex>
      </Flex>
    </Box>
  );
};

export const CommentSkeleton = ({ rows }: { rows?: number }) => {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <Flex
          justify={'between'}
          align={'center'}
          key={index}
          css={{
            mt: '$3',
            '&:nth-of-type(1)': {
              mt: '$6',
            },
          }}
        >
          <Flex gap={'3'} align={'center'}>
            <Circle css={{ size: 32 }} />
            <Line css={{ width: 96, height: 16 }} />
            <Line css={{ width: 192, height: 16 }} />
          </Flex>
          <Line css={{ width: 96, height: 16 }} />
        </Flex>
      ))}
    </>
  );
};
