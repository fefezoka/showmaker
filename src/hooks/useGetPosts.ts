import axios from 'axios';
import { useQueries, UseQueryOptions } from 'react-query';

export const useGetPosts = (T: { id: string }[] | undefined) => {
  const posts = useQueries(
    T?.map<UseQueryOptions<Post>>((id) => {
      return {
        queryKey: ['post', id.id],
        queryFn: async () => {
          const { data } = await axios.get(`/api/post/${id.id}`);
          return data;
        },
        enabled: !!id,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
      };
    }) ?? []
  );
  return posts;
};
