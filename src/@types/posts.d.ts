interface Post {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
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
