import Link from 'next/link';
import React, { memo, forwardRef } from 'react';
import { diffBetweenDates } from '../utils/diffBetweenDates';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { BiDotsHorizontalRounded, BiTrash } from 'react-icons/bi';
import { signIn, useSession } from 'next-auth/react';
import { Post } from '../@types/types';
import { downloadVideo } from 'src/utils/downloadVideo';
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
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  MenuSeparator,
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
            <Flex align={'center'} gap={'2'}>
              <ProfileIcon css={{ size: 36 }} src={post.user.image} alt="" />
              <Box>
                <Text weight={600} size={'5'}>
                  {post.user.name}
                </Text>
                <Text color={'secondary'}>
                  {' • '} {diffBetweenDates(new Date(post.createdAt))}
                </Text>
              </Box>
            </Flex>
          </UserHoverCard>
          <Flex align={'center'} gap={'4'}>
            <Flex
              align={'center'}
              as={'button'}
              gap={'1'}
              css={{ cursor: 'pointer' }}
              onClick={handleLikeClick}
              disabled={likePost.isLoading}
            >
              {post.isLiked ? (
                <Box as={AiFillLike} css={{ color: '$blue-1', size: 28 }} />
              ) : (
                <AiOutlineLike size={28} />
              )}
              <Text size={'5'}>{post.likes}</Text>
            </Flex>

            <Menu>
              <MenuTrigger asChild>
                <Flex as={'button'}>
                  <BiDotsHorizontalRounded size={28} />
                </Flex>
              </MenuTrigger>
              <MenuContent>
                <MenuItem onClick={() => downloadVideo(post.videoUrl, post.title)}>
                  Baixar vídeo
                </MenuItem>
                {post.user.id === session?.user.id && (
                  <>
                    <MenuSeparator />
                    <MenuItem asChild>
                      <Modal>
                        <ModalTrigger asChild>
                          <Flex
                            as={'button'}
                            align={'center'}
                            justify={'center'}
                            css={{ width: '100%', p: '$2' }}
                            gap={'2'}
                          >
                            <Text color={'red-primary'} weight={600}>
                              Apagar vídeo
                            </Text>
                          </Flex>
                        </ModalTrigger>
                        <ModalContent css={{ p: '$5' }}>
                          <Box css={{ mb: '$3' }}>
                            <Heading color={'black-primary'}>Excluir postagem</Heading>
                          </Box>
                          <Box css={{ mb: '$6' }}>
                            <Text color={'black-secondary'}>
                              Deseja realmente excluir o post &quot;{post.title}&quot;?
                            </Text>
                          </Box>
                          <Flex justify={'between'}>
                            <ModalClose asChild>
                              <Button variant={'exit'}>Cancelar</Button>
                            </ModalClose>
                            <Button
                              onClick={() => deletePost.mutate({ postId: post.id })}
                            >
                              Excluir
                            </Button>
                          </Flex>
                        </ModalContent>
                      </Modal>
                    </MenuItem>
                  </>
                )}
              </MenuContent>
            </Menu>
          </Flex>
        </Flex>

        <Flex align={'center'} justify={'between'} css={{ mt: '$1', mb: '$3' }}>
          <Link href={`/post/${post.id}`} prefetch={false}>
            <Heading size="2">{post.title}</Heading>
          </Link>
        </Flex>

        <Video videoUrl={post.videoUrl} thumbnailUrl={post.thumbnailUrl} />

        <FeedPostComments post={post} />
      </Box>
    );
  })
);

FeedPost.displayName = 'FeedPost';
