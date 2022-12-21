import Link from 'next/link';
import React, { useState, memo, forwardRef, useCallback, FormEvent } from 'react';
import { diffBetweenDates } from '../../utils/diffBetweenDates';
import { ProfileIcon } from '../profileIcon/ProfileIcon';
import {
  Flex,
  VideoWrapper,
  PostInfo,
  NewCommentContainer,
  CommentContainer,
} from './style';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useQueryClient, useQuery } from 'react-query';
import { Button } from '../button/Button';
import Spinner from '../../assets/Spinner.svg';
import Image from 'next/image';

interface Props extends React.HTMLProps<HTMLDivElement> {
  post: Post;
  full?: boolean;
}

export const FeedPost = forwardRef(({ post, full, ...props }: Props, forwardRef) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState<boolean>(
    post.likedBy.some((likes) => likes.userId === session?.user.id)
  );

  const volume = useCallback((video: HTMLVideoElement) => {
    const lastVolume = window.localStorage.getItem('volume');
    if (video) {
      video.volume = Number(lastVolume) || 0.25;
    }
  }, []);

  const handleLikeClick = () => {
    if (!session) {
      return signIn('discord');
    }

    isLiked ? dislikePost() : likePost();
  };

  const likePost = async () => {
    setIsLiked(true);
    queryClient.setQueryData<Post>(['post', post.id], (old) =>
      old
        ? {
            ...old,
            likes: old.likes + 1,
            likedBy: [...old.likedBy, { userId: session?.user.id, postId: post.id }],
          }
        : post
    );

    await axios.post('/api/post/like', {
      userId: session?.user.id,
      postId: post.id,
    });
  };

  const dislikePost = async () => {
    setIsLiked(false);
    queryClient.setQueryData<Post>(['post', post.id], (old) =>
      old
        ? {
            ...old,
            likes: old.likes - 1,
            likedBy: old.likedBy.filter((like) => like.userId !== session?.user.id),
          }
        : post
    );

    await axios.post('/api/post/dislike', {
      postId: post.id,
      userId: session?.user.id,
    });
  };

  const { data: comments, isLoading } = useQuery<PostComment[]>(
    ['comments', post.id],
    async () => {
      const { data } = await axios.get(`/api/post/${post.id}/comments`);
      console.log('fetch');
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
  };

  return (
    <section {...props} ref={forwardRef as React.RefObject<HTMLDivElement>}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link href={`/${post.user!.name}`}>
          <Flex>
            <ProfileIcon src={post.user!.image} />
            <h4>{post.user!.name}</h4>
          </Flex>
        </Link>
        <div onClick={handleLikeClick} style={{ textAlign: 'center', cursor: 'pointer' }}>
          {isLiked ? <IoHeart color="red" size={28} /> : <IoHeartOutline size={28} />}
          <p>{post.likes}</p>
        </div>
      </div>

      <PostInfo>
        <Link href={`/post/${post.id}`}>
          <h3>{post.title}</h3>
        </Link>

        <div>
          <span>{diffBetweenDates(new Date(), new Date(post.createdAt))}</span>
        </div>
      </PostInfo>
      <VideoWrapper>
        <video
          controls
          ref={volume}
          onVolumeChange={(e) => {
            e.preventDefault();
            window.localStorage.setItem(
              'volume',
              (e.target as HTMLVideoElement).volume.toFixed(2).toString()
            );
          }}
          preload="none"
          poster={post.thumbnailUrl}
          onClick={(e) => {
            e.preventDefault();
            const video = e.target as HTMLVideoElement;
            video.paused ? video.play() : video.pause();
          }}
        >
          <source src={post.videoUrl} />
        </video>
      </VideoWrapper>

      {full ? (
        <>
          {session && (
            <form onSubmit={commentSubmit}>
              <NewCommentContainer>
                <Link href={`/${session.user.name}`}>
                  <ProfileIcon src={session.user.image} size={42} />
                </Link>
                <input type="text" placeholder="Faça um comentário" />
                <Button value="Enviar" />
              </NewCommentContainer>
            </form>
          )}
          {!isLoading ? (
            comments &&
            comments.map((comment) => (
              <CommentContainer key={comment.id}>
                <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                  <Link href={`/${comment.user.name}`}>
                    <ProfileIcon src={comment.user.image} />
                  </Link>
                  <h4>{comment.user.name}</h4>
                  <span>{comment.message}</span>
                </div>
                <span>{diffBetweenDates(new Date(), new Date(comment.createdAt))}</span>
              </CommentContainer>
            ))
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Image src={Spinner} alt="" priority height={42} width={42} />
            </div>
          )}
        </>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <Link href={`/post/${post.id}`}>
            {post.commentsAmount ? `Ver ${post.commentsAmount} comentários` : 'Comentar'}
          </Link>
        </div>
      )}
    </section>
  );
});

FeedPost.displayName = 'FeedPost';
