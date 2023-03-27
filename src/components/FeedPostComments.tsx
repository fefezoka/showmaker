import React, { FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';
import Link from 'next/link';
import { IoSettingsSharp } from 'react-icons/io5';
import Image from 'next/image';
import axios from 'axios';
import { Box, Flex, Text, Menu, MenuTrigger, MenuContent, MenuItem } from '../styles';
import { Button, ProfileIcon, UserHoverCard } from './';
import { useDeletePostComment, useCreatePostComment } from '../hooks';
import { diffBetweenDates } from '../utils/diffBetweenDates';
import Spinner from '../assets/Spinner.svg';

interface Props {
  post: Post;
}

export const FeedPostComments = ({ post }: Props) => {
  const { data: session } = useSession();
  const deleteComment = useDeletePostComment();
  const createComment = useCreatePostComment();

  const { data: comments, isFetching } = useQuery<PostComment[]>(
    ['comments', post.id],
    async () => {
      const { data } = await axios.get(`/api/post/${post.id}/comments`);
      return data;
    },
    {
      enabled: post.commentsAmount > 0 && !createComment.isLoading,
    }
  );

  const commentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = (e.currentTarget[0] as HTMLInputElement).value;

    e.currentTarget.reset();

    if (!message) {
      return;
    }

    createComment.mutate({ message: message, postId: post.id });
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
      {!isFetching ? (
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
                  <Text size={{ '@initial': '3', '@bp2': '4' }} weight={'bold'}>
                    {comment.user.name}
                  </Text>
                </UserHoverCard>
                <Text size={{ '@initial': '3', '@bp2': '4' }}>{comment.message}</Text>
              </Flex>
            </Flex>
            <Flex gap={'2'} align={'center'}>
              <Text size={{ '@initial': '2', '@bp2': '3' }} css={{ fs: 0 }}>
                {diffBetweenDates(new Date(comment.createdAt))}
              </Text>
              {session?.user.id === comment.user.id && (
                <Menu>
                  <MenuTrigger asChild>
                    <Flex as={'button'}>
                      <IoSettingsSharp />
                    </Flex>
                  </MenuTrigger>
                  <MenuContent css={{ minWidth: 110 }}>
                    <MenuItem
                      onClick={() =>
                        deleteComment.mutate({ commentId: comment.id, postId: post.id })
                      }
                    >
                      Apagar
                    </MenuItem>
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
