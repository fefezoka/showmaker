import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { FormEvent } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Box, Flex, Text, Menu, MenuTrigger, MenuContent, MenuItem } from '../styles';
import { diffBetweenDates } from '../utils/diffBetweenDates';
import { Button } from './Button';
import { ProfileIcon } from './ProfileIcon';
import { UserHoverCard } from './UserHoverCard';
import Spinner from '../assets/Spinner.svg';
import Image from 'next/image';
import { IoSettingsSharp } from 'react-icons/io5';

interface Props {
  post: Post;
}

export const FeedPostComments = ({ post }: Props) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const { data: comments, isLoading } = useQuery<PostComment[]>(
    ['comments', post.id],
    async () => {
      const { data } = await axios.get(`/api/post/${post.id}/comments`);
      return data;
    },
    {
      enabled: post.commentsAmount > 0,
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

    queryClient.setQueryData<Post | undefined>(
      ['post', post.id],
      (old) =>
        old && {
          ...old,
          commentsAmount: old.commentsAmount + 1,
        }
    );
  };

  const deleteComment = async (commentId: string) => {
    await axios.post('/api/post/deleteComment', {
      commentId: commentId,
      postId: post.id,
    });

    queryClient.setQueryData<PostComment[] | undefined>(
      ['comments', post.id],
      (old) => old && old.filter((comments) => comments.id !== commentId)
    );
  };

  return (
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
            <Link href={`/${session.user.name}`} prefetch={false}>
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
            <Flex align={'center'} gap={'3'}>
              <UserHoverCard user={comment.user} href={`/${comment.user.name}`}>
                <ProfileIcon src={comment.user.image} alt="" />
              </UserHoverCard>
              <Flex
                gap={{ '@bp2': '3' }}
                direction={{ '@initial': 'column', '@bp2': 'row' }}
                align={{ '@bp2': 'center' }}
              >
                <UserHoverCard user={comment.user} href={`/${comment.user.name}`}>
                  <Text weight={'bold'}>{comment.user.name}</Text>
                </UserHoverCard>
                <Text>{comment.message}</Text>
              </Flex>
            </Flex>
            <Flex gap={'2'}>
              <Text css={{ fs: 0 }}>
                {diffBetweenDates(new Date(), new Date(comment.createdAt))}
              </Text>
              {session?.user.id === comment.user.id && (
                <Menu>
                  <MenuTrigger asChild>
                    <Box as={'button'}>
                      <IoSettingsSharp />
                    </Box>
                  </MenuTrigger>
                  <MenuContent css={{ minWidth: 110 }}>
                    <MenuItem onClick={() => deleteComment(comment.id)}>Apagar</MenuItem>
                  </MenuContent>
                </Menu>
              )}
            </Flex>
          </Flex>
        ))
      ) : (
        <Box css={{ ta: 'center' }}>
          <Image src={Spinner} alt="" priority height={42} width={42} />
        </Box>
      )}
    </Box>
  );
};
