import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from 'react-query';

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
        const oldHomepageIds = queryClient.getQueryData<PostsPagination>('homepageIds');
        oldHomepageIds &&
          queryClient.setQueryData<PostsPagination>(
            'homepageIds',
            oldHomepageIds.pages[0].unshift({ id: data.id })
              ? oldHomepageIds
              : oldHomepageIds
          );

        const oldSpecificGameHomepage = queryClient.getQueryData<PostsPagination>([
          'feed',
          data.game,
        ]);
        oldSpecificGameHomepage &&
          queryClient.setQueryData<PostsPagination>(
            ['feed', data.game],
            oldSpecificGameHomepage.pages[0].unshift({ id: data.id })
              ? oldSpecificGameHomepage
              : oldSpecificGameHomepage
          );

        const oldProfilePosts = queryClient.getQueryData<PostsPagination>([
          'userposts',
          session?.user.name,
        ]);
        oldProfilePosts &&
          queryClient.setQueryData<PostsPagination>(
            ['userposts', session?.user.name],
            oldProfilePosts?.pages[0].unshift({ id: data.id })
              ? oldProfilePosts
              : oldProfilePosts
          );

        queryClient.setQueryData<Post>(['post', data.id], data);
      },
    }
  );
};
