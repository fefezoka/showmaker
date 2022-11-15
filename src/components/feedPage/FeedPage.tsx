import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { FeedPost } from '../feedPost/FeedPost';

interface Props {
  posts: Post | Post[];
}

export const FeedPage = ({ posts }: Props) => {
  const [userLikes, setUserLikes] = useState<LikedPost[]>();
  const { data: session } = useSession();

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(`/api/user/${session?.user.id}/likes`);
      setUserLikes(data);
    };
    getData();
  }, [session]);

  if (!userLikes) {
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
