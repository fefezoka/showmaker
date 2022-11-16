import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useSession } from 'next-auth/react';
import { FeedPost } from '../feedPost/FeedPost';

interface Props {
  posts: Post | Post[];
}

export const FeedPage = ({ posts }: Props) => {
  const [userLikes, setUserLikes] = useState<LikedPost[]>();
  const { data: session } = useSession();

  const { isLoading } = useQuery(
    ['userLikes', session],
    async () => {
      return await axios.get(`/api/user/${session?.user.id}/likes`);
    },
    {
      onSuccess: (data) => setUserLikes(data?.data),
      enabled: !!session,
    }
  );

  if (isLoading || !userLikes) {
    return <div />;
  }

  return (
    <>
      {Array.isArray(posts) ? (
        posts.map((post) => <FeedPost userLikes={userLikes} post={post} key={post.id} />)
      ) : (
        <FeedPost userLikes={userLikes} post={posts} />
      )}
    </>
  );
};
