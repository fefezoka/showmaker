import { useInfiniteQuery } from 'react-query';
import axios from 'axios';

interface Props {
  api: string;
  query: string | string[];
  enabled?: boolean;
}

export const useInfinitePostIdByScroll = ({ api, query, enabled = true }: Props) => {
  const {
    data: ids,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    query,
    async ({ pageParam = 1 }) => {
      const { data } = await axios.get(api + (api.endsWith('/') ? '' : '/') + pageParam);
      return data;
    },
    {
      getNextPageParam: (currentPage, pages) => {
        return currentPage.length == 6 && pages.length + 1;
      },
      enabled: enabled,
    }
  );

  return { ids, fetchNextPage, hasNextPage };
};
