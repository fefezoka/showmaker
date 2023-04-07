import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

interface Props {
  title: string;
  thumbnail: string;
  file: File;
  game: string;
}

export const useCreatePost = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ game, thumbnail, title, file }: Props) => {
      const XUniqueUploadId = +new Date();

      const processThumbnail = async () => {
        const formdata = new FormData();
        formdata.append('cloud_name', 'dlgkvfmky');
        formdata.append('file', thumbnail);
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
        const size = file.size;
        const sliceSize = 15000000;
        var start = 0;

        const loop: any = async () => {
          var end = start + sliceSize;

          if (end > size) {
            end = size;
          }

          const piece = file.slice.bind(file)(start, end) as File;
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
            headers: {
              'X-Unique-Upload-Id': `${XUniqueUploadId}`,
              'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
            },
          }
        );
        return data;
      };

      const [videoData, thumbData] = await Promise.all([
        processVideo(),
        processThumbnail(),
      ]);

      return await axios.post<Post>('/api/post/insert', {
        ...session?.user,
        title,
        thumbnailUrl: thumbData.secure_url,
        videoUrl: videoData!.secure_url,
        game,
      });
    },
    {
      onSuccess: ({ data }) => {
        queryClient.setQueriesData<PostsPagination>(
          ['posts', 'feed'],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages[0].unshift(data);
            })
        );

        queryClient.setQueryData<PostsPagination>(
          ['posts', 'posts', session?.user.name],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages[0].unshift(data);
            })
        );

        queryClient.setQueryData<Post>(['post', data.id], data);
      },
    }
  );
};
