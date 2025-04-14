import { useState } from 'react';
import axios from 'axios';
import produce from 'immer';
import { trpc } from '@/utils/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { PostPagination } from '@/types/types';
import { signIn, useSession } from 'next-auth/react';
import { ReactQueryOptions, RouterInputs } from '@/server/trpc';

interface UploadVideo {
  game: string;
  title: string;
  file: { video?: File; thumbnail: string };
}

export const useCreatePost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const utils = trpc.useContext();

  const createPostMutation = trpc.posts.create.useMutation({
    onSuccess: (newPost) => {
      utils.posts.feed.home.setInfiniteData(
        {},
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.pages[0].posts.unshift(newPost);
          })
      );

      utils.posts.feed.user.setInfiniteData(
        { username: newPost.user.name, feed: 'posts' },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.pages[0].posts.unshift(newPost);
          })
      );
    },
  });

  const uploadToCloudinary = async ({ file }: Pick<UploadVideo, 'file'>) => {
    const uploadId = Date.now();

    const uploadThumbnail = async () => {
      const formData = new FormData();
      formData.append('cloud_name', 'dlgkvfmky');
      formData.append('file', file.thumbnail);
      formData.append('upload_preset', 'gjfsvh53');

      const { data } = await axios.post(
        'https://api.cloudinary.com/v1_1/dlgkvfmky/upload',
        formData,
        {
          headers: {
            'X-Unique-Upload-Id': String(uploadId),
          },
        }
      );

      return data;
    };

    const uploadVideo = async () => {
      const video = file.video!;
      const totalSize = video.size;
      const chunkSize = 15_000_000;
      let start = 0;

      const uploadChunk = async (): Promise<any> => {
        const end = Math.min(start + chunkSize, totalSize);
        const chunk = video.slice(start, end);

        const formData = new FormData();
        formData.append('cloud_name', 'dlgkvfmky');
        formData.append('file', chunk);
        formData.append('upload_preset', 'tamnuopz');

        const { data } = await axios.post(
          'https://api.cloudinary.com/v1_1/dlgkvfmky/upload',
          formData,
          {
            headers: {
              'X-Unique-Upload-Id': String(uploadId),
              'Content-Range': `bytes ${start}-${end - 1}/${totalSize}`,
            },
            onUploadProgress: (e) => {
              setProgress((start + e.loaded) / totalSize);
            },
          }
        );

        if (end < totalSize) {
          start += chunkSize;
          return uploadChunk();
        }

        return data;
      };

      return await uploadChunk();
    };

    return await Promise.all([uploadVideo(), uploadThumbnail()]);
  };

  const mutateAsync = async ({ game, title, file }: UploadVideo) => {
    setIsLoading(true);

    try {
      const [videoData, thumbData] = await uploadToCloudinary({ file });

      const post = await createPostMutation.mutateAsync({
        game,
        title,
        thumbnailUrl: thumbData.secure_url,
        videoUrl: videoData.secure_url,
      });

      return post;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...createPostMutation,
    mutateAsync,
    progress,
    isLoading,
  };
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return trpc.posts.delete.useMutation({
    onMutate: ({ postId }) => {
      const infiniteQueries = queryClient.getQueriesData(getQueryKey(trpc.posts.feed));

      infiniteQueries.forEach((query) =>
        queryClient.setQueriesData<PostPagination>(
          query[0],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages.map((page) => {
                page.posts = page.posts.filter((postcache) => postcache.id !== postId);
              });
            })
        )
      );
    },
  });
};

export const useEditPost = () => {
  const queryClient = useQueryClient();
  const utils = trpc.useContext();

  return trpc.posts.edit.useMutation({
    onMutate: ({ postId, title, game }) => {
      const infiniteQueries = queryClient.getQueriesData(getQueryKey(trpc.posts.feed));

      infiniteQueries.forEach((query) =>
        queryClient.setQueriesData<PostPagination>(
          query[0],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages.forEach((page) => {
                page.posts.forEach((postcache) => {
                  if (postcache.id === postId) {
                    postcache.title = title ? title : '';

                    if (game) {
                      postcache.game = game;
                    }
                  }
                });
              });
            })
        )
      );

      utils.posts.byId.setData(
        { postId },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.title = title ? title : '';

            if (game) {
              draft.game = game;
            }
          })
      );
    },
  });
};

export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  const utils = trpc.useContext();

  return trpc.posts.unlike.useMutation({
    onMutate: ({ post }) => {
      const newPost = produce(post, (draft) => {
        draft.likes -= 1;
        draft.isLiked = false;
      });

      utils.posts.byId.setData({ postId: post.id }, newPost);

      const infiniteQueries = queryClient.getQueriesData(getQueryKey(trpc.posts.feed));

      infiniteQueries.forEach((query) =>
        queryClient.setQueriesData<PostPagination>(
          query[0],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages.map((page) => {
                page.posts = page.posts.map((postcache) => {
                  if (postcache.id === post.id) {
                    return newPost;
                  }
                  return postcache;
                });
              });
            })
        )
      );
    },
  });
};

type LikeInputs = RouterInputs['posts']['like'];
type LikeConfig = ReactQueryOptions['posts']['like'];

export const useLikePost = () => {
  const queryClient = useQueryClient();
  const utils = trpc.useContext();
  const { data: session } = useSession();

  const like = trpc.posts.like.useMutation({
    onMutate: ({ post }) => {
      const newPost = produce(post, (draft) => {
        draft.isLiked = true;
        draft.likes += 1;
      });

      const infiniteQueries = queryClient.getQueriesData(getQueryKey(trpc.posts.feed));

      infiniteQueries.forEach((query) =>
        queryClient.setQueriesData<PostPagination>(
          query[0],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages.forEach((page) => {
                page.posts = page.posts.map((postcache) => {
                  if (postcache.id === post.id) {
                    return newPost;
                  }
                  return postcache;
                });
              });
            })
        )
      );

      session &&
        utils.posts.feed.user.setInfiniteData(
          { username: session.user.name, feed: 'favorites' },
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages[0].posts.unshift(newPost);
            })
        );

      utils.posts.byId.setData({ postId: post.id }, newPost);
    },
  });

  const mutateAsync = async (input: LikeInputs, config?: LikeConfig) => {
    if (!session) {
      signIn('discord');
      return;
    }
    return await like.mutateAsync({ ...input }, { ...config });
  };

  const mutate = (input: LikeInputs, config?: LikeConfig) => {
    if (!session) {
      signIn('discord');
      return;
    }
    return like.mutate({ ...input }, { ...config });
  };

  return {
    ...like,
    mutate,
    mutateAsync,
  };
};
