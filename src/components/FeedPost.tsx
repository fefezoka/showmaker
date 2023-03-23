import Link from 'next/link';
import React, { memo, forwardRef } from 'react';
import { diffBetweenDates } from '../utils/diffBetweenDates';
import { IoHeartOutline, IoHeart, IoClose } from 'react-icons/io5';
import { signIn, useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';
import { Button, ProfileIcon, Video } from './';
import { UserHoverCard } from './UserHoverCard';
import axios from 'axios';
import {
  Box,
  Flex,
  Text,
  Heading,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalClose,
} from '../styles';
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

      const oldFavorites = queryClient.getQueryData<PostsPagination>([
        'favorites',
        session?.user.name,
      ]);

      oldFavorites &&
        queryClient.setQueryData<PostsPagination>(
          ['favorites', session?.user.name],
          !oldFavorites.pages[0].some((cachepost) => cachepost.id === post.id) &&
            oldFavorites?.pages[0].unshift({ id: post.id })
            ? oldFavorites
            : oldFavorites
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

    const removePost = async () => {
      await axios.post('api/post/remove', {
        postId: post.id,
      });

      const feedPosts = queryClient.getQueryData<PostsPagination>(['homepageIds']);
      feedPosts &&
        queryClient.setQueryData<PostsPagination>(['homepageIds'], {
          ...feedPosts,
          pages: feedPosts.pages.map((page) =>
            page.filter((postcache) => postcache.id !== post.id)
          ),
        });

      const specificFeedPosts = queryClient.getQueryData<PostsPagination>([
        'feed',
        post.game,
      ]);
      specificFeedPosts &&
        queryClient.setQueryData<PostsPagination>(['feed', post.game], {
          ...specificFeedPosts,
          pages: specificFeedPosts.pages.map((page) =>
            page.filter((postcache) => postcache.id !== post.id)
          ),
        });

      const userPosts = queryClient.getQueryData<PostsPagination>([
        'userposts',
        post.user.name,
      ]);
      userPosts &&
        queryClient.setQueryData<PostsPagination>(['userposts', post.user.name], {
          ...userPosts,
          pages: userPosts.pages.map((page) =>
            page.filter((postcache) => postcache.id !== post.id)
          ),
        });

      const userFavoritePosts = queryClient.getQueryData<PostsPagination>([
        'favorites',
        post.user.name,
      ]);
      userFavoritePosts &&
        queryClient.setQueryData<PostsPagination>(['favorites', post.user.name], {
          ...userFavoritePosts,
          pages: userFavoritePosts.pages.map((page) =>
            page.filter((postcache) => postcache.id !== post.id)
          ),
        });
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
          <Flex align={'center'} gap={'3'}>
            <Flex
              align={'center'}
              gap={'1'}
              css={{ cursor: 'pointer' }}
              onClick={handleLikeClick}
            >
              {post.isLiked ? (
                <IoHeart color="red" size={28} />
              ) : (
                <IoHeartOutline size={28} />
              )}
              <Text as={'p'}>{post.likes}</Text>
            </Flex>
            {post.user.id === session?.user.id && (
              <Flex as={'button'}>
                <Modal>
                  <ModalTrigger>
                    <IoClose />
                  </ModalTrigger>
                  <ModalContent css={{ p: '$5' }}>
                    <Box css={{ mb: '$3' }}>
                      <Heading>Excluir postagem</Heading>
                    </Box>
                    <Box css={{ mb: '$6' }}>
                      <Text>
                        Deseja realmente excluir o post &quot;{post.title}&quot;?
                      </Text>
                    </Box>
                    <Flex justify={'between'}>
                      <ModalClose>
                        <Button variant={'exit'} value={'Cancelar'} />
                      </ModalClose>
                      <Button onClick={removePost} value={'Excluir'} />
                    </Flex>
                  </ModalContent>
                </Modal>
              </Flex>
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
