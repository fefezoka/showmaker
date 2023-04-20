import React, { FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { IoSettingsSharp } from 'react-icons/io5';
import {
  Box,
  Flex,
  Text,
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  CommentSkeleton,
} from '@styles';
import { Button, Input, ProfileIcon, UserHoverCard } from '@components';
import { useDeletePostComment, useCreatePostComment } from '@hooks';
import { diffBetweenDates } from '../utils/diffBetweenDates';
import { trpc } from '../utils/trpc';
import { Post } from '../@types/types';

interface FeedPostCommentsProps {
  post: Post;
}

export const FeedPostComments = ({ post }: FeedPostCommentsProps) => {
  const { data: session } = useSession();
  const deleteComment = useDeletePostComment();
  const createComment = useCreatePostComment();

  const { data: comments, isFetching } = trpc.posts.comments.useQuery(
    { postId: post.id },
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
        <Flex
          as="form"
          onSubmit={commentSubmit}
          gap={{ '@initial': '2', '@bp2': '3' }}
          css={{
            mt: '$2',
            '@bp2': {
              mt: '$3',
            },
          }}
        >
          <Link href={`/${session.user.name}`} prefetch={false}>
            <ProfileIcon src={session.user.image} css={{ size: '$8' }} alt="" />
          </Link>
          <Input css={{ br: '$2', p: '$3' }} placeholder="Faça um comentário" />
          <Button type="submit" css={{ minWidth: '52px' }}>
            Enviar
          </Button>
        </Flex>
      )}
      {!isFetching ? (
        comments &&
        comments.map((comment) => (
          <Flex
            align={'center'}
            justify={'between'}
            css={{
              mt: '$2',
              '&:nth-of-type(1)': {
                mt: '$4',
              },
            }}
            key={comment.id}
          >
            <Flex align={'center'} gap={'3'}>
              <UserHoverCard user={comment.user}>
                <ProfileIcon src={comment.user.image} alt="" />
              </UserHoverCard>
              <Flex
                gap={{ '@bp2': '3' }}
                direction={{ '@initial': 'column', '@bp2': 'row' }}
                align={{ '@bp2': 'center' }}
              >
                <UserHoverCard user={comment.user}>
                  <Text size={{ '@initial': '3', '@bp2': '4' }} weight={600}>
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
        <CommentSkeleton rows={2} />
      )}
    </Box>
  );
};
