import axios from 'axios';
import { SetStateAction } from 'react';

interface UploadVideo {
  video: File;
  thumbnail: string;
  setUploadProgress?: React.Dispatch<SetStateAction<number>>;
}

export const uploadVideo = async ({
  video,
  thumbnail,
  setUploadProgress,
}: UploadVideo) => {
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
    const size = video.size;
    const sliceSize = 15000000;
    var start = 0;

    const loop: any = async () => {
      var end = start + sliceSize;

      if (end > size) {
        end = size;
      }

      const piece = video.slice.bind(video)(start, end) as File;
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
        ...(setUploadProgress && {
          onUploadProgress(progressEvent) {
            setUploadProgress((start + progressEvent.loaded) / size);
          },
        }),
        headers: {
          'X-Unique-Upload-Id': `${XUniqueUploadId}`,
          'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
        },
      }
    );
    return data;
  };

  const [videoData, thumbData] = await Promise.all([processVideo(), processThumbnail()]);

  return { videoData, thumbData };
};
