import Link from 'next/link';
import React from 'react';
import { diffBetweenDatesInMinutes } from '../../utils/diffBetweenDatesInMinutes';
import { ProfileIcon } from '../profileIcon/ProfileIcon';
import { Flex, VideoWrapper, PostInfo } from './style';
// import { IoHeartOutline, IoHeart } from 'react-icons/io5';
interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  const diffInMinutes = diffBetweenDatesInMinutes(new Date(), new Date(post.createdAt));

  return (
    <section>
      <Link href={`/post/${post.id}`}>
        <Flex>
          <ProfileIcon src={post.user.avatar_url} />
          <span>{post.user.name}</span>
          {/* <div>
            <IoHeartOutline />
          </div> */}
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
      </Link>
      <VideoWrapper>
        <video controls width="100%" src={post.video_url} />
      </VideoWrapper>
    </section>
  );
};

export default Post;
