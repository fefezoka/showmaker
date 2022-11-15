import React from 'react';
import { Main } from '../../components/main/Main';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import Head from 'next/head';
import { FeedPage } from '../../components/feedPage/FeedPage';

interface Props {
  post: Post;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const { data: post } = await axios.get(`${process.env.SITE_URL}/api/post/${id}`);

  return {
    props: {
      post: post,
    },
  };
};

const Post = ({ post }: Props) => {
  return (
    <>
      <Head>
        <title>
          {post.user?.name} - {post.title}
        </title>
      </Head>
      <Main>
        <FeedPage posts={post} />
      </Main>
    </>
  );
};

export default Post;
