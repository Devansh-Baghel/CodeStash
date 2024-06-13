"use client";

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
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/axios";
import { PostTypes } from "@/types/postTypes";
import { useUserStore } from "@/store/userStore";
import NotLoggedIn from "@/components/NotLoggedIn";
import { useEffect } from "react";

export default function SavedPosts() {
  const { isLoggedIn } = useUserStore();
  const { data, isError, isLoading } = useQuery<PostTypes[]>({
    queryKey: ["saved-posts"],
    queryFn: async () => {
      if (isLoggedIn) {
        return await fetcher.get("/posts/get-saved-posts");
      } else return [];
    },
  });
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <NotLoggedIn description="Login or sign up to view your saved posts" />
    );
  }
  if (isError) return "Error";
  if (isLoading) return "Loading...";

  return (
    <div className="flex flex-col gap-4">
      {data?.map((post) => (
        <Card key={post._id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex gap-1">
              {/* FIXME: Change to solid verison of these icons when clicked */}
              <UpvoteIcon className="h-6 w-6 cursor-pointer" />
              {post.upvotes - post.downvotes}
              <DownvoteIcon className="h-6 w-6 cursor-pointer" />
            </div>
            <div>
              <CardTitle className="">
                <Link href={`/post/${post._id}`}>{post.title}</Link>
              </CardTitle>
              <CardDescription>
                <Link href={`/u/${post.madeBy.username}`}>
                  u/{post.madeBy.username}
                </Link>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p>{post.description}</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p>
              Posted in{" "}
              <Link href={`/c/${post.language}`} className="underline">
                c/{post.language}
              </Link>{" "}
              community
            </p>
            <Button
              variant="solid"
              className="w-full rounded-[20px] bg-primary text-white"
              onClick={() => router.push(`/post/${post._id}`)}
            >
              Show code
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
