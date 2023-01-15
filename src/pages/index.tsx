import Head from 'next/head';
import { Main, TitleAndMetaTags } from '../components';
import { useGetPosts } from '../hooks/useGetPosts';
import { useInfinitePostIdByScroll } from '../hooks/useInfinitePostIdByScroll';
import { Box, Heading } from '../styles';
import { PostPaginator } from '../components/PostPaginator';

export default function Timeline() {
  const { ids, fetchNextPage, hasNextPage } = useInfinitePostIdByScroll({
    api: '/api/post/page',
    query: 'homepageIds',
  });

  const posts = useGetPosts(
    ids?.pages.reduce((accumulator, currentValue) => accumulator.concat(currentValue))
  );

  if (!ids || !posts || posts.slice(0, 6).some((post) => post.isLoading === true)) {
    return <Main loading />;
  }

  return (
    <>
      <TitleAndMetaTags
        title="Showmaker - Página inicial"
        imageUrl={posts[0].data?.videoUrl}
      />

      <Main>
        <Box as={'section'}>
          <Heading>Últimos posts</Heading>
        </Box>
        <PostPaginator
          posts={posts}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
      </Main>
    </>
  );
}
