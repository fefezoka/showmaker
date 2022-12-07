interface Post {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  likedBy: LikedPost[];
  commentsAmount: number;
  postComments?: PostComment[];
  user?: User;
}

interface LikedPost {
  id?: string;
  userId?: string;
  postId: string;
}

interface PostComment {
  id?: string;
  userId?: string;
  postId: string;
  createdAt: Date;
  message: string;
  user: User;
}
