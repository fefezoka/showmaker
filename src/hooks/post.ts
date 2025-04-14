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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const utils = trpc.useContext();

  const sendToDB = trpc.posts.create.useMutation({
    onSuccess: (data) => {
      utils.posts.feed.home.setInfiniteData(
        {},
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.pages[0].posts.unshift(data);
          })
      );

      utils.posts.feed.user.setInfiniteData(
        { username: data.user.name, feed: 'posts' },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.pages[0].posts.unshift(data);
          })
      );
    },
  });

  const sendToCloud = async ({ file }: Pick<UploadVideo, 'file'>) => {
    const XUniqueUploadId = +new Date();

    const processThumbnail = async () => {
      const formdata = new FormData();
      formdata.append('cloud_name', 'dlgkvfmky');
      formdata.append('file', file.thumbnail);
      formdata.append('upload_preset', 'gjfsvh53');

      const { data } = await axios.post(
        'https://api.cloudinary.com/v1_1/dlgkvfmky/upload',
        formdata,
        {
          headers: {
            'X-Unique-Upload-Id': `${XUniqueUploadId}`,
          },
        }
      );
      return data;
    };

    const processVideo = async () => {
      const size = file.video!.size;
      const sliceSize = 15000000;
      var start = 0;

      const loop: any = async () => {
        var end = start + sliceSize;

        if (end > size) {
          end = size;
        }

        const piece = file.video!.slice.bind(file.video)(start, end) as File;
        const videoData = await sendVideoPiece(piece, start, end - 1, size);
        if (end < size) {
          start += sliceSize;
          return loop();
        }
        return videoData;
      };
      return await loop();
    };

    const sendVideoPiece = async (
      piece: File,
      start: number,
      end: number,
      size: number
    ) => {
      const formdata = new FormData();
      formdata.append('cloud_name', 'dlgkvfmky');
      formdata.append('file', piece);
      formdata.append('upload_preset', 'tamnuopz');

      const { data } = await axios.post(
        'https://api.cloudinary.com/v1_1/dlgkvfmky/upload',
        formdata,
        {
          onUploadProgress(progressEvent) {
            setProgress((start + progressEvent.loaded) / size);
          },
          headers: {
            'X-Unique-Upload-Id': `${XUniqueUploadId}`,
            'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
          },
        }
      );
      return data;
    };

    return await Promise.all([processVideo(), processThumbnail()]);
  };

  const mutateAsync = async ({ game, title, file }: UploadVideo) => {
    setIsLoading(true);

    const [videoData, thumbData] = await sendToCloud({ file });

    const post = await sendToDB.mutateAsync({
      game,
      title,
      thumbnailUrl: thumbData.secure_url,
      videoUrl: videoData.secure_url,
    });

    setIsLoading(false);
    return post;
  };

  const { mutate, ...data } = sendToDB;

  return {
    ...data,
    progress,
    mutateAsync,
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
