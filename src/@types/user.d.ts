interface User {
  id: string;
  name: string;
  image: string;
  posts: { id: string }[];
  createdAt: Date;
  updatedAt: Date;
}
