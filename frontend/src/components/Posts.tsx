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
import { PostTypes } from "@/types/postTypes";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Posts() {
  const searchParams = useSearchParams();
  const language = searchParams.get("language");
  const router = useRouter();
  const { isLoggedIn } = useUserStore();
  const {
    data,
    isError,
    isPending,
    error,
    refetch,
    isRefetchError,
    isRefetching,
  } = useQuery<PostTypes[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!language) {
        return await fetcher.get("/posts/get-posts");
      } else {
        return await fetcher.post("/posts/get-posts-by-language", { language });
      }
    },
    retry: 1,
  });

  // This is cause when user clicks on homepage icon to go to / , then it refetches the query
  useEffect(() => {
    refetch();
  }, [refetch, searchParams]);

  // TODO: Add better loading and error states
  if (isPending || isRefetching) return "Loading...";
  if (isError || isRefetchError) {
    // FIXME: fix ts error
    if (error.response.status === 404) {
      // TODO: add better looking ui for not supported language
      return "This language isn't supported yet";
    }
    return "error";
  }

  function handleInteraction() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // do the interaction , upvote downvote etc
    console.log("Interaction!!!");
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((post) => (
        <Card key={post._id}>
          <CardHeader className="flex flex-row gap-4">
            <div className="flex flex-col items-center">
              {/* FIXME: Change to solid verison of these icons when clicked */}
              <UpvoteIcon
                className="h-5 w-5 cursor-pointer"
                onClick={handleInteraction}
              />
              {post.upvotes - post.downvotes}
              <DownvoteIcon
                className="h-5 w-5 cursor-pointer"
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
