interface Post {
  id: string;
  title: string;
  video_url: string;
  likes: int;
  createdAt: date;
  updatedAt: date;
  likedBy: LikedPost[];
  user?: User;
}

interface LikedPost {
  id?: string;
  userId?: string;
  postId: string;
}
