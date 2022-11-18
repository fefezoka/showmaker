import React, { useState } from 'react';
import { Main } from '../../components/main/Main';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { FeedPost } from '../../components/feedPost/FeedPost';

const Post = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: post, isLoading } = useQuery<Post>(
    ['post', id],
    async () => {
      const { data } = await axios.get(`/api/post/${id}`);
      return data;
    },
    {
      enabled: !!id,
      staleTime: Infinity,
    }
  );

  if (isLoading) {
    return <Main />;
  }

  if (!post) {
    return (
      <Main>
        <section>
          <h2>Post não encontrado</h2>
        </section>
      </Main>
    );
  }

  return (
    <>
      <Head>
        <title>
          {post.user?.name} - {post.title}
        </title>
      </Head>
      <Main>
        <FeedPost post={post} />
      </Main>
    </>
  );
};

export default Post;
