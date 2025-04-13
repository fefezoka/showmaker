export const getVideoThumbnail = (file: File) => {
  return new Promise<string>((resolve) => {
    const fileURL = URL.createObjectURL(file);
    const video = document.createElement('video');
    const timeupdate = () => {
      if (snapImage()) {
        video.removeEventListener('timeupdate', timeupdate);
        video.pause();
      }
    };
    video.addEventListener('loadeddata', () => {
      if (snapImage()) {
        video.removeEventListener('timeupdate', timeupdate);
      }
    });
    const snapImage = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 960;
      canvas.height = 540;
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL('image/jpeg');
      const success = image.length > 100000;
      if (success) {
        URL.revokeObjectURL(fileURL);
        resolve(image);
      }
      return success;
    };
    video.addEventListener('timeupdate', timeupdate);
    video.preload = 'metadata';
    video.src = fileURL;
    video.muted = true;
    video.playsInline = true;
    video.currentTime = 0;
    video.play();
  });
};
