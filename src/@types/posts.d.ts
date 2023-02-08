interface Post {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  commentsAmount: number;
  isLiked: boolean;
  game: string;
  postComments?: PostComment[];
  user: User;
}

interface PostComment {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
  message: string;
  user: User;
}
