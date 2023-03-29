interface User {
  id: string;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  followYou: boolean;
  isFollowing: boolean;
  followersAmount: number;
  followingAmount: number;
  osuAccountId?: string;
  twitchAccountId: string;
}
