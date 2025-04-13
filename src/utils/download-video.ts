import { Post } from '@/types/types';
import axios from 'axios';

export const downloadVideo = (post: Post) => {
  axios.get(post.videoUrl, { responseType: 'blob' }).then((response) => {
    const urlObject = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlObject;
    link.setAttribute(
      'download',
      (post.title || 'video').replace(' ', '_') + '_' + post.user.name + '.mp4'
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};
