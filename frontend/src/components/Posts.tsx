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
import { Button, Textarea } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

type PostTypes = {
  _id: string;
  title: string;
  content: string;
  description: string;
  madeBy: { userId: string; fullname: string; username: string };
  upvotes: number;
  downvotes: number;
  language: string;
};

export default function Posts() {
  const router = useRouter();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const { data, isError, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await fetcher.get("/posts/get-posts"),
  });

  // TODO: Add better loading and error states
  if (isPending) return "Loading...";
  if (isError) return "Erorr";

  function handleInteraction() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // do the interaction , upvote downvote etc
    console.log("Interaction!!!");
  }

  console.log(data);

  return (
    <div className="flex flex-col gap-4">
      {data.map((post: PostTypes) => (
        <Card key={post._id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex gap-1">
              {/* FIXME: Change to solid verison of these icons when clicked */}
              <UpvoteIcon
                className="h-6 w-6 cursor-pointer"
                onClick={handleInteraction}
              />
              {post.upvotes - post.downvotes}
              <DownvoteIcon
                className="h-6 w-6 cursor-pointer"
                onClick={handleInteraction}
              />
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
