export type PostTypes = {
  _id: string;
  title: string;
  content: string;
  description: string;
  madeBy: { userId: string; fullname: string; username: string };
  upvotes: number;
  downvotes: number;
  language: string;
  community: string;
};
