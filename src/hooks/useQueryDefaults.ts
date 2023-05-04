import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { PostPagination } from '@types';
import { trpc } from '@utils';

export const useQueryDefaults = () => {
  const queryClient = useQueryClient();
  const utils = trpc.useContext();

  const queryKeys = getQueryKey(trpc.posts.feed);
  queryClient.setQueryDefaults(queryKeys, {
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    onSuccess(data: PostPagination) {
      data.pages[data.pages.length - 1].posts.forEach((post) =>
        utils.posts.byId.setData({ postId: post.id }, post)
      );
    },
  });
};
