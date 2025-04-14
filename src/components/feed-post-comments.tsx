import React, { FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { IoSettingsSharp } from 'react-icons/io5';
import { FiDelete, FiEdit } from 'react-icons/fi';
import { useCreatePostComment, useDeletePostComment } from '@/hooks/post-comment';
import { trpc } from '@/utils/trpc';
import { EditComment } from '@/components/edit-comment';
import { UserHoverCard } from '@/components/user-hover-card';
import { Box } from '@/styles/box';
import { Button } from '@/styles/button';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from '@/styles/dropdown-menu';
import { Flex } from '@/styles/flex';
import { Input } from '@/styles/input';
import { ProfileIcon } from '@/styles/profile-icon';
import { CommentSkeleton } from '@/styles/skeleton';
import { diffBetweenDates } from '@/utils/diff-between-dates';
import { Post } from '@prisma/client';
import { Text } from '@/styles/text';

interface IFeedPostComments {
  post: Post;
}

export const FeedPostComments = ({ post }: IFeedPostComments) => {
  const { data: session } = useSession();
  const deleteComment = useDeletePostComment();
  const createComment = useCreatePostComment();

  const { data: comments, isFetching } = trpc.posts.comments.useQuery(
    { postId: post.id },
    {
      enabled: post.commentsAmount > 0 && !createComment.isPending,
    }
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
          onSubmit={handleSubmit}
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
          <Input radius={'2'} css={{ p: '$3' }} placeholder="Faça um comentário" />
          <Button type="submit" css={{ minWidth: '72px' }}>
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
              >
                <UserHoverCard user={comment.user}>
                  <Text size={{ '@initial': '3', '@bp2': '4' }} weight={600}>
                    {comment.user.name}
                  </Text>
                </UserHoverCard>
                <Text size={{ '@initial': '3', '@bp2': '4' }}>{comment.message}</Text>
              </Flex>
            </Flex>
            <Flex gap={'2'} align={'center'} css={{ fs: 0 }}>
              <Text css={{ color: '$slate11' }} size={{ '@initial': '2', '@bp2': '3' }}>
                {diffBetweenDates(comment.createdAt)}
              </Text>
              {session?.user.id === comment.user.id && (
                <Menu modal={false}>
                  <MenuTrigger asChild>
                    <Flex as={'button'} css={{ color: '$slate11' }}>
                      <IoSettingsSharp />
                    </Flex>
                  </MenuTrigger>
                  <MenuContent>
                    <EditComment comment={comment} postId={post.id}>
                      <MenuItem onSelect={(e) => e.preventDefault()}>
                        <FiEdit />
                        Editar
                      </MenuItem>
                    </EditComment>
                    <MenuSeparator />
                    <MenuItem
                      theme={'alert'}
                      onClick={() =>
                        deleteComment.mutate({ commentId: comment.id, postId: post.id })
                      }
                    >
                      <FiDelete />
                      Apagar
                    </MenuItem>
                  </MenuContent>
                </Menu>
              )}
            </Flex>
          </Flex>
        ))
      ) : (
        <CommentSkeleton rows={post.commentsAmount} />
      )}
    </Box>
  );
};
