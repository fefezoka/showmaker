import Link from 'next/link';
import React, { useState, memo } from 'react';
import { diffBetweenDatesInMinutes } from '../../utils/diffBetweenDatesInMinutes';
import { ProfileIcon } from '../profileIcon/ProfileIcon';
import { Flex, VideoWrapper, PostInfo } from './style';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';

interface Props {
  post: Post;
  userLikes?: LikedPost[];
}

export const FeedPost = memo(({ post, userLikes }: Props) => {
  const { data: session } = useSession();
  const [postLikes, setPostLikes] = useState<number>(post.likes);
  const [isLiked, setIsLiked] = useState<boolean>(
    userLikes?.some((like) => like.postId === post.id) || false
  );

  const likePost = async () => {
    setIsLiked(true);
    setPostLikes((l) => l + 1);
    await axios.post('/api/post/like', {
      userId: session?.user.id,
      postId: post.id,
    });
  };

  const dislikePost = async () => {
    setIsLiked(false);
    setPostLikes((l) => l - 1);
    await axios.post('/api/post/dislike', {
      postId: post.id,
    });
  };
  const diffInMinutes = diffBetweenDatesInMinutes(new Date(), new Date(post.createdAt));

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link href={`/${post.user!.name}`}>
          <Flex>
            <ProfileIcon src={post.user!.image} />
            <span>{post.user!.name}</span>
          </Flex>
        </Link>
        <div onClick={isLiked ? dislikePost : likePost} style={{ textAlign: 'center' }}>
          {isLiked ? <IoHeart color="red" size={28} /> : <IoHeartOutline size={28} />}
          <p>{postLikes}</p>
        </div>
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
});

FeedPost.displayName = 'FeedPost';
