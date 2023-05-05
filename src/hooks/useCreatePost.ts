import { useState } from 'react';
import axios from 'axios';
import produce from 'immer';
import { trpc } from '@utils';

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

    const [thumbData, videoData] = await sendToCloud({ file });

    const post = await sendToDB.mutateAsync({
      game,
      thumbnailUrl: videoData.secure_url,
      title,
      videoUrl: thumbData.secure_url,
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
