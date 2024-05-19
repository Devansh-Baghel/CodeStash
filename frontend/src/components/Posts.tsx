"use client";
import fetcher from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

type PostTypes = {
  _id: string;
  title: string;
  content: string;
  description: string;
  madeBy: string;
  upvotes: number;
  downvotes: number;
};

export default function Posts() {
  const { data, isError, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await fetcher.get("/posts/get-posts"),
  });

  if (isPending) return "Loading...";
  if (isError) return "Erorr";

  console.log(data);

  return (
    <div>
      {data.map((post: PostTypes) => (
        <div key={post._id}>{post.title}</div>
      ))}
    </div>
  );
}
