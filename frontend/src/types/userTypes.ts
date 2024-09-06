export type UserTypes = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  madeBy: {
    fullName: string;
    _id: string;
  };
  avatar: string;
  upvotedPosts: string[];
  downvotedPosts: string[];
  upvotedComments: string[];
  downvotedComments: string[];
  savedPosts: string[];
  communitiesJoined: string[];
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isVerified: boolean;
};
