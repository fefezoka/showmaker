import React, { useCallback } from 'react';
import { styled } from 'stitches.config';
import { Box } from '@styles';

const StyledVideo = styled('video', {
  position: 'absolute',
  size: '100%',
  objectFit: 'fill',
});

interface IVideo extends React.ComponentProps<typeof StyledVideo> {
  videoUrl: string;
  thumbnailUrl: string;
}

export const Video = ({ videoUrl, thumbnailUrl, ...props }: IVideo) => {
  const volume = useCallback((video: HTMLVideoElement) => {
    const lastVolume = window.localStorage.getItem('volume');
    if (video) {
      video.volume = Number(lastVolume) || 0.25;
    }
  }, []);

  return (
    <Box
      css={{
        overflow: 'hidden',
        width: '100%',
        br: '$4',
        cursor: 'pointer',
        position: 'relative',
        pb: '56.25%',
        bs: '0px 0px 0px 1px var(--colors-bg4)',
      }}
    >
      <StyledVideo
        {...props}
        controls
        ref={volume}
        onVolumeChange={(e) => {
          e.preventDefault();
          window.localStorage.setItem(
            'volume',
            (e.target as HTMLVideoElement).volume.toFixed(2).toString()
          );
        }}
        preload="none"
        poster={thumbnailUrl}
        onClick={(e) => {
          e.preventDefault();
          const video = e.target as HTMLVideoElement;
          video.paused ? video.play() : video.pause();
        }}
      >
        <source src={videoUrl} />
      </StyledVideo>
    </Box>
  );
};
