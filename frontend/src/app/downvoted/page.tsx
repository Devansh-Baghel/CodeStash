"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/axios";
import { PostTypes } from "@/types/postTypes";
import { useUserStore } from "@/store/userStore";
import NotLoggedIn from "@/components/NotLoggedIn";

export default function DownvotedPosts() {
  const { isLoggedIn } = useUserStore();
  const { data, isError, isLoading } = useQuery<PostTypes[]>({
    queryKey: ["downvoted-posts"],
    queryFn: async () => {
      // FIXME: make sure to not run the query when user isn't logged in
      // if (isLoggedIn) {
      return await fetcher.get("/posts/get-downvoted");
      // } else return [];
    },
  });

  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <NotLoggedIn description="Login or sign up to view your downvoted posts" />
    );
  }
  if (isError) return "Error";
  if (isLoading) return "Loading...";

  if (data?.length === 0) {
    return "You haven't downvoted any posts yet";
  }

  return (
    <div className="flex flex-col gap-4">
      {data?.map((post) => (
        <Card key={post._id}>
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
            {/* TODO: Maybe add a remove from downvotes button here? */}
            {/* <Button
              variant="flat"
              color="primary"
              className="w-full rounded-[20px]"
              // onClick={async () => {
              //   await removeSavedPost(post._id);
              //   refetch();
              // }}
            >
              Remove from saved
            </Button> */}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}