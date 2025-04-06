import React from 'react';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '../../server/routers/_app';
import { createContext } from '../../server/context';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import superjson from 'superjson';
import { trpc } from '@utils';
import { blitz } from '@assets';
import { PostPagination } from '@types';
import { Main, FeedPost } from '@components';
import { Flex, PostSkeleton, Text } from '@styles';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';

interface Props {
  dehydratedState: any;
  id: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id as string;

  if (ctx.req.url?.startsWith('/_next')) {
    return {
      props: { id },
    };
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(ctx),
    transformer: superjson,
  });

  await helpers.posts.byId.prefetch({ postId: id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};

export default function Post({ id }: Props) {
  const queryClient = useQueryClient();

  const { data: post, isLoading } = trpc.posts.byId.useQuery(
    { postId: id },
    {
      initialData: () => {
        const queryKeys = getQueryKey(trpc.posts.feed);
        const routers = queryClient.getQueriesData<PostPagination>(queryKeys);

        return routers
          .filter((route) => route[1])
          .map((route) =>
            route[1]?.pages.map((page) => page.posts.find((post) => post.id === id))
          )[0]?.[0];
      },
      staleTime: 1,
    }
  );

  return (
    <>
      {post && (
        <NextSeo
          title={post.title || ''}
          openGraph={{
            images: [{ url: post.thumbnailUrl }],
            siteName: '',
            description: '',
            videos: [{ url: post.videoUrl }],
            type: 'video.other',
          }}
        />
      )}
      {
        <Main>
          {isLoading && <PostSkeleton />}
          {post && !isLoading && <FeedPost post={post} />}
          {!post && !isLoading && (
            <Flex as={'section'} align={'center'} direction={'column'}>
              <Text size={'6'}>Post não encontrado</Text>
              <Image src={blitz} alt="" height={256} width={256} />
            </Flex>
          )}
        </Main>
      }
    </>
  );
}
