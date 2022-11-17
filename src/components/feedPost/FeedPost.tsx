import Link from 'next/link';
import React, { useState, memo, useEffect } from 'react';
import { diffBetweenDates } from '../../utils/diffBetweenDates';
import { ProfileIcon } from '../profileIcon/ProfileIcon';
import { Flex, VideoWrapper, PostInfo } from './style';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';

interface Props {
  post: Post;
}

export const FeedPost = memo(({ post }: Props) => {
  const { data: session } = useSession();
  const [postLikes, setPostLikes] = useState<number>(post.likedBy.length);
  const [isLiked, setIsLiked] = useState<boolean>();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsLiked(post.likedBy.some((likes) => likes.userId === session?.user.id));
  }, [session, post.likedBy]);

  const handleLikeClick = () => {
    if (!session) {
      return signIn('discord');
    }

    isLiked ? dislikePost() : likePost();
  };

  const likePost = async () => {
    setIsLiked(true);
    setPostLikes((l) => l + 1);
    await axios.post('/api/post/like', {
      userId: session?.user.id,
      postId: post.id,
    });
    await queryClient.clear();
  };

  const dislikePost = async () => {
    setIsLiked(false);
    setPostLikes((l) => l - 1);
    await axios.post('/api/post/dislike', {
      postId: post.id,
    });
    await queryClient.clear();
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link href={`/${post.user!.name}`}>
          <Flex>
            <ProfileIcon src={post.user!.image} />
            <span>{post.user!.name}</span>
          </Flex>
        </Link>
        <div onClick={handleLikeClick} style={{ textAlign: 'center', cursor: 'pointer' }}>
          {isLiked ? <IoHeart color="red" size={28} /> : <IoHeartOutline size={28} />}
          <p>{postLikes}</p>
        </div>
      </div>

      <PostInfo>
        <Link href={`/post/${post.id}`}>
          <h3>{post.title}</h3>
        </Link>

        <div>
          <span>{diffBetweenDates(new Date(), new Date(post.createdAt))}</span>
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
