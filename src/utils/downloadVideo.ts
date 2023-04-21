import axios from 'axios';

export const downloadVideo = (url: string, title: string) => {
  axios.get(url, { responseType: 'blob' }).then((response) => {
    const urlObject = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlObject;
    link.setAttribute('download', title.replace(' ', '_') + '.mp4');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};
