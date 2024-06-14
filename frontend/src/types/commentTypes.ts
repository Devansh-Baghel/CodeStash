export type Comment = {
  _id: string;
  madeBy: {
    userId: string;
    username: string;
  };
  parent: string;
  type: "comment" | "reply";
  content: string;
  upvotes: number;
  downvotes: number;
};
