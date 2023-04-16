import Link from 'next/link';
import React, { memo, forwardRef } from 'react';
import { diffBetweenDates } from '../utils/diffBetweenDates';
import { IoHeartOutline, IoHeart, IoClose } from 'react-icons/io5';
import { signIn, useSession } from 'next-auth/react';
import { Post } from '../@types/types';
import { Button, ProfileIcon, Video, UserHoverCard, FeedPostComments } from '@components';
import {
  Box,
  Flex,
  Text,
  Heading,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalClose,
} from '@styles';
import { useDeletePost, useLikePost, useDislikePost } from '@hooks';

interface FeedPostProps extends React.HTMLProps<HTMLDivElement> {
  post: Post;
}

export const FeedPost = memo(
  forwardRef(({ post, ...props }: FeedPostProps, forwardRef) => {
    const { data: session } = useSession();
    const deletePost = useDeletePost();
    const likePost = useLikePost();
    const dislikePost = useDislikePost();

    const handleLikeClick = () => {
      if (!session) {
        return signIn('discord');
      }

      post.isLiked ? dislikePost.mutate({ post }) : likePost.mutateAsync({ post });
    };

    return (
      <Box as={'section'} {...props} ref={forwardRef as React.RefObject<HTMLDivElement>}>
        <Flex justify={'between'}>
          <UserHoverCard user={post.user}>
            <Flex align={'center'} gap={'4'}>
              <ProfileIcon src={post.user.image} alt="" />
              <Text weight={600}>{post.user.name}</Text>
            </Flex>
          </UserHoverCard>
          <Flex align={'center'} gap={'3'}>
            <Flex
              align={'center'}
              as={'button'}
              gap={'1'}
              css={{ cursor: 'pointer' }}
              onClick={handleLikeClick}
              disabled={likePost.isLoading}
            >
              {post.isLiked ? (
                <IoHeart color="red" size={28} />
              ) : (
                <IoHeartOutline size={28} />
              )}
              <Text as={'p'}>{post.likes}</Text>
            </Flex>
            {post.user.id === session?.user.id && (
              <Modal>
                <ModalTrigger>
                  <Flex>
                    <IoClose />
                  </Flex>
                </ModalTrigger>
                <ModalContent css={{ p: '$5' }}>
                  <Box css={{ mb: '$3' }}>
                    <Heading>Excluir postagem</Heading>
                  </Box>
                  <Box css={{ mb: '$6' }}>
                    <Text>Deseja realmente excluir o post &quot;{post.title}&quot;?</Text>
                  </Box>
                  <Flex justify={'between'}>
                    <ModalClose asChild>
                      <Button variant={'exit'}>Cancelar</Button>
                    </ModalClose>
                    <Button onClick={() => deletePost.mutate({ postId: post.id })}>
                      Excluir
                    </Button>
                  </Flex>
                </ModalContent>
              </Modal>
            )}
          </Flex>
        </Flex>

        <Flex align={'center'} justify={'between'} css={{ mt: '$2', mb: '$4' }}>
          <Link href={`/post/${post.id}`} prefetch={false}>
            <Heading>{post.title}</Heading>
          </Link>
          <Box css={{ flexShrink: 0 }}>
            <Text size={'3'}>{diffBetweenDates(new Date(post.createdAt))}</Text>
          </Box>
        </Flex>

        <Video videoUrl={post.videoUrl} thumbnailUrl={post.thumbnailUrl} />

        <FeedPostComments post={post} />
      </Box>
    );
  })
);

FeedPost.displayName = 'FeedPost';
