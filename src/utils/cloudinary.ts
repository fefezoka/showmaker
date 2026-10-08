// Cloudinary renders a frame of an uploaded video as an image when the
// extension is swapped to an image format, so no separate thumbnail upload is
// needed. so_0 = frame at second 0.
export const videoThumbnailUrl = (
  videoUrl: string,
  transformation = "so_0,w_960,h_540,c_fill,q_auto,f_auto"
) =>
  videoUrl
    .replace("/video/upload/", `/video/upload/${transformation}/`)
    .replace(/\.[^./]+$/, ".jpg")

// Thumbnails of older posts were uploaded as separate image assets
export const isDerivedThumbnail = (thumbnailUrl: string) =>
  thumbnailUrl.includes("/video/upload/")
