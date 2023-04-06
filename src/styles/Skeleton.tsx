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

export const Line = ({
  rows,
  width,
  height,
}: {
  rows?: number;
  width?: number;
  height: number;
}) => {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <Box
          key={index}
          css={{
            width: width ? width : '100%',
            height,
            animation: `${Glow} 1.5s ease-out 0s infinite normal`,
            br: '$2',
            ...(rows && rows > 1 && { mb: '$2' }),
          }}
        />
      ))}
    </>
  );
};

export const Circle = ({ size }: { size: number }) => {
  return (
    <Box
      css={{
        size,
        br: '$round',
        animation: `${Glow} 1.5s ease-out 0s infinite normal`,
        fs: 0,
      }}
    />
  );
};

export const Rectangle = ({ height, width }: { height: number; width?: number }) => {
  return (
    <Box
      css={{
        height,
        width: width ? width : '100%',
        animation: `${Glow} 1.5s ease-out 0s infinite normal`,
        br: '$1',
        fs: 0,
      }}
    />
  );
};

export const PostSkeleton = () => {
  return (
    <Box css={{ p: '$6', borderBottom: '2px solid $bgalt' }}>
      <Flex align={'center'} justify={'between'}>
        <Flex align={'center'} gap={'2'}>
          <Circle size={32} />
          <Line height={24} width={120} />
        </Flex>
        <Line height={24} width={60} />
      </Flex>
      <Flex css={{ mt: '$2' }} justify={'between'} gap={'3'}>
        <Line height={24} width={240} />
        <Line height={24} width={120} />
      </Flex>
      <Box css={{ mt: '$3' }}>
        <Rectangle height={320} />
      </Box>
      <Flex align={'center'} justify={'center'} css={{ mt: '$3' }} gap={'4'}>
        <Circle size={40} />
        <Line height={40} />
        <Rectangle height={40} width={88} />
      </Flex>
    </Box>
  );
};

export const ProfileSkeleton = () => {
  return (
    <Box css={{ p: '$6', pb: 0 }}>
      <Flex gap={'4'} css={{ mb: '$6' }} align={'center'}>
        <Circle size={144} />
        <Line height={24} width={192} />
      </Flex>
      <Line rows={2} height={16} width={200} />
      <Flex css={{ mt: '$4' }} justify={'center'} gap={'4'}>
        <Rectangle height={40} width={120} />
        <Rectangle height={40} width={120} />
      </Flex>
    </Box>
  );
};
