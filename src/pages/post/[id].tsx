import React from 'react';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '../../server/routers/_app';
import { createContext } from '../../server/context';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import BlitzNotFound from '../../assets/blitz.webp';
import Image from 'next/image';
import { trpc } from '../../utils/trpc';
import { Post as PostType } from '../../@types/types';
import { Main, FeedPost } from '@components';
import { Flex, Heading, PostSkeleton } from '@styles';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.req.url?.startsWith('/_next')) {
    return {
      props: {},
    };
  }

  const id = ctx.params?.id as string;

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(ctx),
  });

  await helpers.posts.byId.prefetch({ postId: id });

  return {
    props: {
      dehydratedState: JSON.parse(
        JSON.stringify(helpers.dehydrate().queries[0].state.data ?? null)
      ),
    },
  };
};

export default function Post({ dehydratedState }: { dehydratedState: PostType }) {
  const router = useRouter();
  const { id } = router.query;

  const { data: post, isLoading } = trpc.posts.byId.useQuery(
    { postId: id as string },
    { enabled: !!id }
  );

  return (
    <>
      <NextSeo
        {...(dehydratedState
          ? {
              title: `${dehydratedState.user.name} - ${dehydratedState.title}`,
              openGraph: {
                images: [{ url: dehydratedState.thumbnailUrl }],
                videos: [{ url: dehydratedState.videoUrl }],
                type: 'video.other',
              },
            }
          : post && { title: `${post.title} // ${post.user.name}` })}
      />

      <Main>
        {isLoading && <PostSkeleton />}
        {post && !isLoading && <FeedPost post={post} />}
        {!post && !isLoading && (
          <Flex as={'section'} align={'center'} direction={'column'}>
            <Heading>Post não encontrado</Heading>
            <Image src={BlitzNotFound} alt="" height={256} width={256} />
          </Flex>
        )}
      </Main>
    </>
  );
}
