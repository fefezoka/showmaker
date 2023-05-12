import Link from 'next/link';
import React, { forwardRef } from 'react';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { useSession } from 'next-auth/react';
import { Post } from '@types';
import { downloadVideo, diffBetweenDates } from '@utils';
import { UserHoverCard, FeedPostComments, EditPost } from '@components';
import {
  Box,
  Flex,
  Button,
  ProfileIcon,
  Video,
  Text,
  Heading,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalClose,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  MenuSeparator,
} from '@styles';
import { useDeletePost, useLikePost, useUnlikePost } from '@hooks';

export const FeedPost = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Box> & {
    post: Post;
  }
>(({ post, ...props }, forwardRef) => {
  const { data: session } = useSession();
  const deletePost = useDeletePost();
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();

  return (
    <Box as={'section'} {...props} ref={forwardRef}>
      <Flex justify={'between'}>
        <UserHoverCard user={post.user}>
          <Flex align={'center'} gap={'2'} css={{ us: 'none' }}>
            <ProfileIcon css={{ size: 36 }} src={post.user.image} alt="" />
            <Box>
              <Text weight={600} size={{ '@initial': '3', '@bp2': '5' }}>
                {post.user.name}
              </Text>
              <Text color={'gray'} size={{ '@initial': '2', '@bp2': '3' }}>
                {' • '} {diffBetweenDates(post.createdAt)}
              </Text>
            </Box>
          </Flex>
        </UserHoverCard>
        <Flex align={'center'} gap={{ '@initial': '2', '@bp2': '4' }}>
          <Flex
            align={'center'}
            as={'button'}
            gap={'1'}
            onClick={() => {
              post.isLiked ? unlikePost.mutate({ post }) : likePost.mutateAsync({ post });
            }}
            disabled={likePost.isLoading}
          >
            {post.isLiked ? (
              <Box
                as={AiFillLike}
                css={{ color: '$blue10', size: 22, '@bp2': { size: 28 } }}
              />
            ) : (
              <Box
                as={AiOutlineLike}
                css={{ color: '$slate11', size: 22, '@bp2': { size: 28 } }}
              />
            )}
            <Text size={{ '@initial': '3', '@bp2': '5' }} color={'gray'}>
              {post.likes}
            </Text>
          </Flex>

          <Menu modal={false}>
            <MenuTrigger asChild>
              <Flex as={'button'}>
                <Flex
                  as={BiDotsHorizontalRounded}
                  css={{
                    size: 24,
                    p: '2px',
                    br: '$round',
                    transition: 'all 300ms ease-out',
                    color: '$slate11',

                    '&:hover': {
                      transition: 'all 300ms ease-in',
                      color: '$blue10',
                      bc: '$bg2',
                    },

                    '@bp2': {
                      size: 30,
                    },
                  }}
                />
              </Flex>
            </MenuTrigger>
            <MenuContent>
              {post.user.id === session?.user.id && (
                <EditPost post={post}>
                  <MenuItem onSelect={(e) => e.preventDefault()}>Editar</MenuItem>
                </EditPost>
              )}
              <MenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    window.location.origin + '/post/' + post.id
                  )
                }
              >
                Copiar link
              </MenuItem>
              <MenuItem onClick={() => downloadVideo(post)}>Baixar vídeo</MenuItem>
              {post.user.id === session?.user.id && (
                <>
                  <MenuSeparator />
                  <Modal>
                    <ModalTrigger>
                      <MenuItem theme={'alert'} onSelect={(e: any) => e.preventDefault()}>
                        Apagar vídeo
                      </MenuItem>
                    </ModalTrigger>
                    <ModalContent css={{ p: '$5' }}>
                      <Box css={{ mb: '$3' }}>
                        <Heading>Excluir postagem</Heading>
                      </Box>
                      <Box css={{ mb: '$6' }}>
                        <Text color={'gray'}>
                          Deseja realmente excluir o post &quot;{post.title}&quot;?
                        </Text>
                      </Box>
                      <Flex justify={'between'}>
                        <ModalClose asChild>
                          <Button variant={'red'}>Cancelar</Button>
                        </ModalClose>
                        <Button onClick={() => deletePost.mutate({ postId: post.id })}>
                          Excluir
                        </Button>
                      </Flex>
                    </ModalContent>
                  </Modal>
                </>
              )}
            </MenuContent>
          </Menu>
        </Flex>
      </Flex>

      <Flex css={{ mt: '$1', mb: '$3' }}>
        {post.title && (
          <Box
            css={{ width: '100%' }}
            as={Link}
            href={`/post/${post.id}`}
            prefetch={false}
          >
            <Heading size={'2'}>{post.title}</Heading>
          </Box>
        )}
      </Flex>

      <Video videoUrl={post.videoUrl} thumbnailUrl={post.thumbnailUrl} />

      <FeedPostComments post={post} />
    </Box>
  );
});

FeedPost.displayName = 'FeedPost';
