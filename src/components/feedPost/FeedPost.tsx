import Link from 'next/link';
import React from 'react';
import { diffBetweenDatesInMinutes } from '../../utils/diffBetweenDatesInMinutes';
import { ProfileIcon } from '../profileIcon/ProfileIcon';
import { Flex, VideoWrapper, PostInfo } from './style';
// import { IoHeartOutline, IoHeart } from 'react-icons/io5';

interface Props {
  post: Post;
}

export const FeedPost = ({ post }: Props) => {
  const diffInMinutes = diffBetweenDatesInMinutes(new Date(), new Date(post.createdAt));

  return (
    <section>
      <div>
        <Link href={`/${post.user.name}`}>
          <Flex>
            <ProfileIcon src={post.user.avatar_url} />
            <span>{post.user.name}</span>
            {/* <div>
            <IoHeartOutline />
          </div> */}
          </Flex>
        </Link>
      </div>

      <PostInfo>
        <Link href={`/post/${post.id}`}>
          <h3>{post.title}</h3>
        </Link>

        <div>
          {diffInMinutes < 60 ? (
            <span>{diffInMinutes}m atrás</span>
          ) : (
            <span>{Math.floor(diffInMinutes / 60)}h atrás</span>
          )}
        </div>
      </PostInfo>
      <VideoWrapper>
        <video controls preload="metadata" width="100%">
          <source src={post.video_url} />
        </video>
      </VideoWrapper>
    </section>
  );
};
