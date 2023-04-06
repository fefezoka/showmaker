import { QueryKey, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Props {
  api: string;
  query: QueryKey;
  enabled?: boolean;
}

export const useInfinitePostIdByScroll = ({ api, query, enabled = true }: Props) => {
  const queryClient = useQueryClient();

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<Post[]>(
    query,
    async ({ pageParam = 1 }) => {
      const { data } = await axios.get(api + (api.endsWith('/') ? '' : '/') + pageParam);
      return data;
    },
    {
      getNextPageParam: (currentPage, pages) => {
        return currentPage.length == 6 && pages.length + 1;
      },
      onSuccess: (data) => {
        data.pages.forEach((page) => {
          page.forEach((post) => {
            queryClient.setQueryData(['post', post.id], post);
          });
        });
      },
      enabled: enabled,
    }
  );

  return {
    posts: posts?.pages.reduce((accumulator, currentValue) =>
      accumulator.concat(currentValue)
    ),
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  };
};
