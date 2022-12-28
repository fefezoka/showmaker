interface User {
  id: string;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  posts: { id: string }[];
}
