import React from 'react';
import { Main } from '../../components/main/Main';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import Head from 'next/head';
const FeedPost = dynamic(() => import('../../components/feedPost/FeedPost'), {
  ssr: false,
});

interface Props {
  post: Post;
}

// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'http://show-maker.vercel.app';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const { data: post } = await axios.get(`${BASE_URL}/api/post/${id}`);

  return {
    props: {
      post: post,
    },
  };
};

const Post = ({ post }: Props) => {
  console.log(post);
  return (
    <>
      <Head>
        <title>
          {post.user.name} - {post.title}
        </title>
      </Head>
      <Main>
        <FeedPost post={post} />
      </Main>
    </>
  );
};

export default Post;
