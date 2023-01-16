import axios from 'axios';
import { useQueries, UseQueryOptions } from 'react-query';

export const useGetPosts = (T: { id: string }[] | undefined) => {
  const posts = useQueries(
    T?.map<UseQueryOptions<Post>>((post) => {
      return {
        queryKey: ['post', post.id],
        queryFn: async () => {
          const { data } = await axios.get(`/api/post/${post.id}`);
          return data;
        },
        enabled: !!post,
      };
    }) ?? []
  );
  return posts;
};
