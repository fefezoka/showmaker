import Link from 'next/link';
import React, { memo, forwardRef, FormEvent } from 'react';
import { diffBetweenDates } from '../utils/diffBetweenDates';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { signIn, useSession } from 'next-auth/react';
import { useQueryClient, useQuery } from 'react-query';
import { Button, ProfileIcon } from './';
import { UserHoverCard } from './UserHoverCard';
import axios from 'axios';
import Spinner from '../assets/Spinner.svg';
import Image from 'next/image';
import { Box, Flex, Text, Heading } from '../styles';
import { Video } from './Video';

interface Props extends React.HTMLProps<HTMLDivElement> {
  post: Post;
  full?: boolean;
}

export const FeedPost = memo(
  forwardRef(({ post, full, ...props }: Props, forwardRef) => {
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

      queryClient.setQueryData<Post>(['post', post.id], (old) =>
        old
          ? {
              ...old,
              likes: old.likes + 1,
              isLiked: true,
            }
          : post
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

      queryClient.setQueryData<Post>(['post', post.id], (old) =>
        old
          ? {
              ...old,
              likes: old.likes - 1,
              isLiked: false,
            }
          : post
      );
    };

    const { data: comments, isLoading } = useQuery<PostComment[]>(
      ['comments', post.id],
      async () => {
        const { data } = await axios.get(`/api/post/${post.id}/comments`);
        return data;
      },
      {
        enabled: !!full && post.commentsAmount > 0,
        staleTime: Infinity,
      }
    );

    const commentSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const message = (e.currentTarget[0] as HTMLInputElement).value;

      e.currentTarget.reset();

      if (!message) {
        return;
      }

      const { data } = await axios.post('/api/post/newComment', {
        postId: post.id,
        userId: session?.user.id,
        message: message,
      });

      queryClient.setQueryData<PostComment[]>(['comments', post.id], (old) => [
        data,
        ...(old ? old : []),
      ]);

      queryClient.setQueryData<Post>(['post', post.id], (old) =>
        old
          ? {
              ...old,
              commentsAmount: old.commentsAmount + 1,
            }
          : {
              ...post,
              commentsAmount: post.commentsAmount + 1,
            }
      );
    };

    return (
      <Box as={'section'} {...props} ref={forwardRef as React.RefObject<HTMLDivElement>}>
        <Flex justify={'between'}>
          <UserHoverCard user={post.user}>
            <Link href={`/${post.user.name}`}>
              <Flex align={'center'} gap={'4'}>
                <ProfileIcon src={post.user.image} alt="" />
                <Text weight={'bold'}>{post.user.name}</Text>
              </Flex>
            </Link>
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
          <Link href={`/post/${post.id}`}>
            <Heading>{post.title}</Heading>
          </Link>
          <Box css={{ flexShrink: 0 }}>
            <Text size={'3'}>
              {diffBetweenDates(new Date(), new Date(post.createdAt))}
            </Text>
          </Box>
        </Flex>

        <Video videoUrl={post.videoUrl} thumbnailUrl={post.thumbnailUrl} />

        {full ? (
          <Box>
            {session && (
              <Box as="form" onSubmit={commentSubmit}>
                <Flex
                  gap={{ '@initial': '2', '@bp2': '4' }}
                  css={{
                    mt: '$4',
                    input: {
                      color: 'white',
                      borderRadius: '$2',
                      width: '100%',
                      padding: '0 $3',
                      backgroundColor: '$bgalt',
                      fontSize: '$3',
                    },

                    'input::placeholder': {
                      color: '$gray',
                    },
                  }}
                >
                  <Link href={`/${session.user.name}`}>
                    <ProfileIcon src={session.user.image} css={{ size: '$8' }} alt="" />
                  </Link>
                  <Box as="input" type="text" placeholder="Faça um comentário" />
                  <Button type="submit" value="Enviar" />
                </Flex>
              </Box>
            )}
            {!isLoading ? (
              comments &&
              comments.map((comment) => (
                <Flex
                  align={'center'}
                  justify={'between'}
                  css={{
                    mt: '$3',
                    '&:nth-of-type(1)': {
                      mt: '$6',
                    },
                  }}
                  key={comment.id}
                >
                  <Flex gap={'3'} align={'center'}>
                    <UserHoverCard user={comment.user}>
                      <Link href={`/${comment.user.name}`}>
                        <Flex align={'center'} gap={'3'}>
                          <ProfileIcon src={comment.user.image} alt="" />
                          <Text weight={'bold'}>{comment.user.name}</Text>
                        </Flex>
                      </Link>
                    </UserHoverCard>
                    <Text>{comment.message}</Text>
                  </Flex>
                  <Text>{diffBetweenDates(new Date(), new Date(comment.createdAt))}</Text>
                </Flex>
              ))
            ) : (
              <Box css={{ ta: 'center' }}>
                <Image src={Spinner} alt="" priority height={42} width={42} />
              </Box>
            )}
          </Box>
        ) : (
          <Box css={{ mt: '$4' }}>
            <Link href={`/post/${post.id}`}>
              <Text size={'3'}>
                {post.commentsAmount
                  ? `Ver ${post.commentsAmount} comentários`
                  : 'Comentar'}
              </Text>
            </Link>
          </Box>
        )}
      </Box>
    );
  })
);

FeedPost.displayName = 'FeedPost';
