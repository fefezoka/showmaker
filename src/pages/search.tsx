import React from 'react';
import { NextSeo } from 'next-seo';
import { GetServerSideProps } from 'next';
import { trpc } from '@utils';
import { useSession } from 'next-auth/react';
import { Main, PostPaginator, UserHoverCard } from '@components';
import { Box, Button, Flex, Grid, Heading, ProfileIcon, Text } from '@styles';
import { useFollow, useUnfollow } from '@hooks';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { q } = query;

  if (!q) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      q,
    },
  };
};

export default function Search({ q }: { q: string }) {
  const utils = trpc.useContext();
  const follow = useFollow();
  const unfollow = useUnfollow();
  const { data: session } = useSession();

  const posts = trpc.posts.feed.search.useInfiniteQuery(
    { q },
    {
      enabled: !!q,
      getNextPageParam: (lastPage, pages) =>
        lastPage.posts.length === 6 && pages.length + 1,
      onSuccess(data) {
        data.pages.forEach((page) =>
          page.posts.forEach((post) =>
            utils.posts.byId.setData({ postId: post.id }, post)
          )
        );
      },
    }
  );

  const users = trpc.user.search.useQuery({ q });

  const { data: friendshipStatuses } = trpc.user.manyFriendshipStatus.useQuery(
    {
      users: users.data,
    },
    {
      enabled: !!(users.data && users.data.length !== 0),
    }
  );

  if (posts.isError && users.isError) {
    return (
      <Main>
        <Box as={'section'}>
          <Heading size="2">Post não encontrado</Heading>
        </Box>
      </Main>
    );
  }

  return (
    <Main>
      <NextSeo title={`Procurando por ${q}`} />
      <Box as={'section'}>
        <Heading size="2">Procurando por &quot;{q}&quot;</Heading>
      </Box>

      {users.data && users.data.length !== 0 && (
        <Box as={'section'}>
          <Heading>Usuários</Heading>
          <Grid columns={'3'} gap={'2'} css={{ mt: '$1' }}>
            {users.data.map((user, index) => (
              <Box css={{ bc: '$bg2', p: '$3', br: '$2' }} key={index}>
                <Flex justify={'between'} css={{ mb: '$2' }}>
                  <UserHoverCard user={user}>
                    <ProfileIcon src={user.image} alt="" css={{ size: 52 }} />
                  </UserHoverCard>
                  {friendshipStatuses && user.id !== session?.user.id && (
                    <Button
                      size={1}
                      onClick={() =>
                        friendshipStatuses[user.id].following
                          ? unfollow.mutate({ followingUser: user })
                          : follow.mutate({ followingUser: user })
                      }
                    >
                      {friendshipStatuses[user.id].following ? 'Seguindo' : 'Seguir'}
                    </Button>
                  )}
                </Flex>
                <UserHoverCard user={user}>
                  <Flex align={'center'} gap={'1'}>
                    <Text weight={600}>{user.name}</Text>
                    {friendshipStatuses && friendshipStatuses[user.id].followed_by && (
                      <Text color={'secondary'} size={'1'}>
                        • Segue você
                      </Text>
                    )}
                  </Flex>
                </UserHoverCard>
              </Box>
            ))}
          </Grid>
        </Box>
      )}
      <PostPaginator
        posts={posts.data}
        loading={posts.isLoading}
        fetchNextPage={posts.fetchNextPage}
        hasNextPage={posts.hasNextPage}
      />
    </Main>
  );
}
