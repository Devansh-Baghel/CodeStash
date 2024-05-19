"use client";
import fetcher from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BiUpvote as UpvoteIcon } from "react-icons/bi";
import { BiDownvote as DownvoteIcon } from "react-icons/bi";

type PostTypes = {
  _id: string;
  title: string;
  content: string;
  description: string;
  madeBy: { userId: string; fullname: string };
  upvotes: number;
  downvotes: number;
};

export default function Posts() {
  const { data, isError, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await fetcher.get("/posts/get-posts"),
  });

  // TODO: Add better loading and error states
  if (isPending) return "Loading...";
  if (isError) return "Erorr";

  return (
    <div className="flex flex-col gap-4">
      {data.map((post: PostTypes) => (
        <Card key={post._id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex gap-1">
              {/* FIXME: Change to solid verison of these icons when clicked */}
              <UpvoteIcon className="w-6 h-6" />
              {post.upvotes - post.downvotes}
              <DownvoteIcon className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="">Card Title</CardTitle>
              <CardDescription>{post.madeBy.fullname}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p>Code will be here</p>
            <p>
              Description here, there will be a show more button if the
              description is too long
            </p>
          </CardContent>
          <CardFooter>
            <p>Posted in ____ community</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
