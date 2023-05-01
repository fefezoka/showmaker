import Link from 'next/link';
import React, { memo, forwardRef, useState, FormEvent } from 'react';
import { AiFillLike, AiOutlineLike, AiOutlineClose } from 'react-icons/ai';
import { BiDotsHorizontalRounded, BiCheck } from 'react-icons/bi';
import { signIn, useSession } from 'next-auth/react';
import { Post } from '@types';
import { downloadVideo, diffBetweenDates } from '@utils';
import { UserHoverCard, FeedPostComments } from '@components';
import {
  Box,
  Flex,
  Button,
  ProfileIcon,
  Input,
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
import { useDeletePost, useLikePost, useDislikePost, useEditPost } from '@hooks';

interface IFeedPost extends React.ComponentProps<typeof Box> {
  post: Post;
}

export const FeedPost = memo(
  forwardRef<HTMLDivElement, IFeedPost>(({ post, ...props }, forwardRef) => {
    const [editing, setEditing] = useState<boolean>();
    const { data: session } = useSession();
    const deletePost = useDeletePost();
    const editPost = useEditPost();
    const likePost = useLikePost();
    const dislikePost = useDislikePost();

    const handleLikeClick = () => {
      if (!session) {
        return signIn('discord');
      }

      post.isLiked ? dislikePost.mutate({ post }) : likePost.mutateAsync({ post });
    };

    const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const title = (e.currentTarget[0] as HTMLInputElement).value;

      title !== post.title && (await editPost.mutateAsync({ postId: post.id, title }));
      setEditing(false);
    };

    return (
      <Box as={'section'} {...props} ref={forwardRef}>
        <Flex justify={'between'}>
          <UserHoverCard user={post.user}>
            <Flex align={'center'} gap={'2'}>
              <ProfileIcon css={{ size: 36 }} src={post.user.image} alt="" />
              <Box>
                <Text weight={600} size={{ '@initial': '3', '@bp2': '5' }}>
                  {post.user.name}
                </Text>
                <Text color={'secondary'} size={{ '@initial': '2', '@bp2': '3' }}>
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
              css={{ cursor: 'pointer' }}
              onClick={handleLikeClick}
              disabled={likePost.isLoading}
            >
              {post.isLiked ? (
                <Box
                  as={AiFillLike}
                  css={{ color: '$blue-2', size: 22, '@bp2': { size: 28 } }}
                />
              ) : (
                <Box
                  as={AiOutlineLike}
                  css={{ color: '$text-secondary', size: 22, '@bp2': { size: 28 } }}
                />
              )}
              <Text size={{ '@initial': '3', '@bp2': '5' }} color={'secondary'}>
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
                      color: '$text-secondary',

                      '&:hover': {
                        transition: 'all 300ms ease-in',
                        color: '$blue-1',
                        bc: '$bg-2',
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
                  <MenuItem onClick={() => setEditing(true)}>Editar</MenuItem>
                )}
                <MenuItem onClick={() => downloadVideo(post.videoUrl, post.title)}>
                  Baixar vídeo
                </MenuItem>
                {post.user.id === session?.user.id && (
                  <>
                    <MenuSeparator />
                    <Modal>
                      <ModalTrigger>
                        <MenuItem
                          theme={'alert'}
                          onSelect={(e: any) => e.preventDefault()}
                        >
                          Apagar vídeo
                        </MenuItem>
                      </ModalTrigger>
                      <ModalContent css={{ p: '$5' }}>
                        <Box css={{ mb: '$3' }}>
                          <Heading color={'primary'}>Excluir postagem</Heading>
                        </Box>
                        <Box css={{ mb: '$6' }}>
                          <Text color={'secondary'}>
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

        <Flex align={'center'} justify={'between'} css={{ mt: '$1', mb: '$3' }}>
          {editing ? (
            <Box
              as={'form'}
              onSubmit={(e) => handleEdit(e)}
              css={{ width: '50%', position: 'relative' }}
            >
              <Input
                placeholder={post.title}
                css={{
                  '&::placeholder': { fontSize: '$5' },
                  fontSize: '$5',
                  fontWeight: 600,
                }}
              />
              <Box css={{ position: 'absolute', right: 36, top: 9 }}>
                <Box as={'button'} type="submit">
                  <BiCheck color="white" size={22} />
                </Box>
              </Box>
              <Box css={{ position: 'absolute', right: 12, top: 12 }}>
                <Box
                  as={'button'}
                  onClick={() => {
                    setEditing(false);
                  }}
                >
                  <AiOutlineClose color="white" size={18} />
                </Box>
              </Box>
            </Box>
          ) : (
            <Link href={`/post/${post.id}`} prefetch={false}>
              <Heading size={'2'}>{post.title}</Heading>
            </Link>
          )}
        </Flex>

        <Video videoUrl={post.videoUrl} thumbnailUrl={post.thumbnailUrl} />

        <FeedPostComments post={post} />
      </Box>
    );
  })
);

FeedPost.displayName = 'FeedPost';
