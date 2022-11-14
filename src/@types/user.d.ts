interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  createdAt: Date;
  updatedAt: Date;
  posts: Post[];
}
