import Image from 'next/image';
import React from 'react';
import { diffBetweenDatesInMinutes } from '../../utils/diffBetweenDatesInMinutes';
import { ProfileIcon } from '../profileIcon/ProfileIcon';
import { Container, Flex, VideoWrapper, PostInfo } from './style';

interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  const diffInMinutes = diffBetweenDatesInMinutes(new Date(), new Date(post.createdAt));

  return (
    <Container>
      <Flex>
        <ProfileIcon src={post.user.avatar_url} />
        <span>{post.user.name}</span>
      </Flex>
      <PostInfo>
        <h3>{post.title}</h3>
        <div>
          {diffInMinutes < 60 ? (
            <span>{diffInMinutes}m atrás</span>
          ) : (
            <span>{Math.floor(diffInMinutes / 60)}h atrás</span>
          )}
        </div>
      </PostInfo>

      <VideoWrapper>
        <video controls width="100%" src={post.video_url} />
      </VideoWrapper>
    </Container>
  );
};

export default Post;
