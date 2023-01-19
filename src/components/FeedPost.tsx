import Link from 'next/link';
import React, { memo, forwardRef } from 'react';
import { diffBetweenDates } from '../utils/diffBetweenDates';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { signIn, useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';
import { ProfileIcon, Video } from './';
import { UserHoverCard } from './UserHoverCard';
import axios from 'axios';
import { Box, Flex, Text, Heading } from '../styles';
import { FeedPostComments } from './FeedPostComments';

interface Props extends React.HTMLProps<HTMLDivElement> {
  post: Post;
  // full?: boolean;
}

export const FeedPost = memo(
  forwardRef(({ post, ...props }: Props, forwardRef) => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const handleLikeClick = () => {
      if (!session) {
        return signIn('discord');
      }

      post.isLiked ? dislikePost() : likePost();
    };

    const likePost = async () => {
      await axios.post('/api/post/like', {
        userId: session?.user.id,
        postId: post.id,
      });

      queryClient.setQueryData<Post | undefined>(
        ['post', post.id],
        (old) =>
          old && {
            ...old,
            likes: old.likes + 1,
            isLiked: true,
          }
      );

      queryClient.setQueryData<{ pages: [{ id: string }][] } | undefined>(
        ['favorites', session?.user.name],
        (old) =>
          old
            ? !old?.pages[0].some((cachepost) => cachepost.id === post.id)
              ? old?.pages[0].unshift({ id: post.id })
                ? old
                : old
              : old
            : undefined
      );
    };

    const dislikePost = async () => {
      await axios.post('/api/post/dislike', {
        postId: post.id,
        userId: session?.user.id,
      });

      queryClient.setQueryData<Post | undefined>(
        ['post', post.id],
        (old) =>
          old && {
            ...old,
            likes: old.likes - 1,
            isLiked: false,
          }
      );
    };

    return (
      <Box as={'section'} {...props} ref={forwardRef as React.RefObject<HTMLDivElement>}>
        <Flex justify={'between'}>
          <UserHoverCard user={post.user} href={`/${post.user.name}`}>
            <Flex align={'center'} gap={'4'}>
              <ProfileIcon src={post.user.image} alt="" />
              <Text weight={'bold'}>{post.user.name}</Text>
            </Flex>
          </UserHoverCard>
          <Box css={{ ta: 'center', cursor: 'pointer' }} onClick={handleLikeClick}>
            {post.isLiked ? (
              <IoHeart color="red" size={28} />
            ) : (
              <IoHeartOutline size={28} />
            )}
            <Text as={'p'}>{post.likes}</Text>
          </Box>
        </Flex>

        <Flex align={'center'} justify={'between'} css={{ mb: '$4' }}>
          <Link href={`/post/${post.id}`} prefetch={false}>
            <Heading>{post.title}</Heading>
          </Link>
          <Box css={{ flexShrink: 0 }}>
            <Text size={'3'}>
              {diffBetweenDates(new Date(), new Date(post.createdAt))}
            </Text>
          </Box>
        </Flex>

        <Video videoUrl={post.videoUrl} thumbnailUrl={post.thumbnailUrl} />

        <FeedPostComments post={post} />

        {/* {full ? (
          <FeedPostComments post={post} />
        ) : (
          <Box css={{ mt: '$4' }}>
            <Link href={`/post/${post.id}`} prefetch={false}>
              <Text size={'3'}>
                {post.commentsAmount
                  ? `Ver ${post.commentsAmount} comentários`
                  : 'Comentar'}
              </Text>
            </Link>
          </Box>
        )} */}
      </Box>
    );
  })
);

FeedPost.displayName = 'FeedPost';
