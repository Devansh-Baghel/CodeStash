"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/axios";
import { PostTypes } from "@/types/postTypes";
import { useUserStore } from "@/store/userStore";
import NotLoggedIn from "@/components/NotLoggedIn";
import { cn } from "@/lib/utils";
import { cardLayout } from "@/utils/classnames";
import PostsLoading from "@/components/skeletons/PostsLoading";

export default function SavedPosts() {
  const { isLoggedIn, removeSavedPost } = useUserStore();
  const { data, isError, isLoading, refetch, isRefetchError, isRefetching } =
    useQuery<PostTypes[]>({
      queryKey: ["saved-posts"],
      queryFn: async () => {
        // FIXME: make sure to not run the query when user isn't logged in
        // if (isLoggedIn) {
        return await fetcher.get("/posts/get-saved-posts");
        // } else return [];
      },
    });

  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <NotLoggedIn description="Login or sign up to view your saved posts" />
    );
  }

  if (isError || isRefetchError) return "Error";
  if (isLoading || isRefetching) return <PostsLoading items={1} />;

  if (data?.length === 0) {
    // TODO: add ui for no when user has no saved posts
    return (
      <Card className="ml-20 mt-20 flex flex-col items-center justify-center">
        <CardHeader>
          <h1>You haven't saved any posts yet</h1>
        </CardHeader>
        <CardContent>
          <Button color="primary" onClick={() => router.push("/")}>
            Go to homepage
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data?.map((post) => (
        <Card key={post._id} className={cn(cardLayout)}>
          <CardHeader className="flex flex-row items-center gap-4">
            <div>
              <CardTitle className="text-lg">
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
            <Button
              variant="flat"
              color="primary"
              className="w-full rounded-[20px]"
              onClick={async () => {
                await removeSavedPost(post._id);
                refetch();
              }}
            >
              Remove from saved
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
