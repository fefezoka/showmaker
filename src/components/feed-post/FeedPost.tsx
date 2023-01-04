import Link from 'next/link';
import React, { memo, forwardRef, useCallback, FormEvent } from 'react';
import { diffBetweenDates } from '../../utils/diffBetweenDates';
import { ProfileIcon } from '../profileIcon/ProfileIcon';
import { VideoWrapper, NewCommentContainer, CommentContainer } from './style';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { signIn, useSession } from 'next-auth/react';
import { useQueryClient, useQuery } from 'react-query';
import { Button } from '../button/Button';
import { UserHoverCard } from '../user-hover-card/UserHoverCard';
import axios from 'axios';
import Spinner from '../../assets/Spinner.svg';
import Image from 'next/image';

interface Props extends React.HTMLProps<HTMLDivElement> {
  post: Post;
  full?: boolean;
}

export const FeedPost = memo(
  forwardRef(({ post, full, ...props }: Props, forwardRef) => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

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

      post.isLiked ? dislikePost() : likePost();
    };

    const likePost = async () => {
      await axios.post('/api/post/like', {
        userId: session?.user.id,
        postId: post.id,
      });

      queryClient.setQueryData<Post>(['post', post.id], (old) =>
        old
          ? {
              ...old,
              likes: old.likes + 1,
              isLiked: true,
            }
          : post
      );

      queryClient.setQueryData<{ pages: [{ id: string }][] } | undefined>(
        ['favorites', session?.user.name],
        (old) =>
          old
            ? !old?.pages[0].some((cachepost) => cachepost.id === post.id)
              ? old?.pages[0].unshift({ id: post.id })
                ? old
                : old
              : old
            : undefined
      );
    };

    const dislikePost = async () => {
      await axios.post('/api/post/dislike', {
        postId: post.id,
        userId: session?.user.id,
      });

      queryClient.setQueryData<Post>(['post', post.id], (old) =>
        old
          ? {
              ...old,
              likes: old.likes - 1,
              isLiked: false,
            }
          : post
      );
    };

    const { data: comments, isLoading } = useQuery<PostComment[]>(
      ['comments', post.id],
      async () => {
        const { data } = await axios.get(`/api/post/${post.id}/comments`);
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

      queryClient.setQueryData<Post>(['post', post.id], (old) =>
        old
          ? {
              ...old,
              commentsAmount: old.commentsAmount + 1,
            }
          : {
              ...post,
              commentsAmount: post.commentsAmount + 1,
            }
      );
    };

    return (
      <section {...props} ref={forwardRef as React.RefObject<HTMLDivElement>}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <UserHoverCard user={post.user}>
            <Link href={`/${post.user.name}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ProfileIcon src={post.user.image} alt="" />
                <h4>{post.user.name}</h4>
              </div>
            </Link>
          </UserHoverCard>
          <div
            onClick={handleLikeClick}
            style={{ textAlign: 'center', cursor: 'pointer' }}
          >
            {post.isLiked ? (
              <IoHeart color="red" size={28} />
            ) : (
              <IoHeartOutline size={28} />
            )}
            <p>{post.likes}</p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            marginBottom: '12px',
            justifyContent: 'space-between',
          }}
        >
          <Link href={`/post/${post.id}`}>
            <h3>{post.title}</h3>
          </Link>
          <div>
            <span>{diffBetweenDates(new Date(), new Date(post.createdAt))}</span>
          </div>
        </div>

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
          <div>
            {session && (
              <form onSubmit={commentSubmit}>
                <NewCommentContainer>
                  <Link href={`/${session.user.name}`}>
                    <ProfileIcon src={session.user.image} size={42} alt="" />
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
                    <UserHoverCard user={comment.user}>
                      <Link href={`/${comment.user.name}`}>
                        <div
                          style={{
                            display: 'flex',
                            gap: '.75rem',
                            alignItems: 'center',
                          }}
                        >
                          <ProfileIcon src={comment.user.image} alt="" />
                          <h4>{comment.user.name}</h4>
                        </div>
                      </Link>
                    </UserHoverCard>
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
          </div>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            <Link href={`/post/${post.id}`}>
              {post.commentsAmount
                ? `Ver ${post.commentsAmount} comentários`
                : 'Comentar'}
            </Link>
          </div>
        )}
      </section>
    );
  })
);

FeedPost.displayName = 'FeedPost';
