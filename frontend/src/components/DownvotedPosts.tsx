"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import NotLoggedIn from "@/components/NotLoggedIn";
import PostsNotFound from "@/components/PostsNotFound";
import PostsLoading from "@/components/skeletons/PostsLoading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { PostTypes } from "@/types/postTypes";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

export default function DownvotedPosts({ hasTitle = true }) {
  const { isLoggedIn, userData } = useUserStore();
  const { data, isError, isLoading } = useQuery<PostTypes[]>({
    queryKey: ["downvoted-posts"],
    queryFn: async () => {
      if (userData?.downvotedPosts.length === 0) {
        return [];
      }
      return await fetcher.get("/posts/get-downvoted");
    },
  });

  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <NotLoggedIn
        title="Downvoted Posts"
        description="Login or sign up to view your downvoted posts"
      />
    );
  }
  if (isError) return "Error";
  if (isLoading)
    return <PostsLoading items={userData?.downvotedPosts.length || 2} />;

  if (data?.length === 0) {
    return <PostsNotFound description="You haven't downvoted any posts yet" />;
  }

  return (
    <section className={cn(hasTitle ? cardLayout : "")}>
      {hasTitle && (
        <h1 className="mb-4 text-2xl font-bold text-gray-600">
          Downvoted Posts
        </h1>
      )}
      <div className="flex flex-col gap-8">
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
                <Link href={`/c/${post.community}`} className="underline">
                  c/{post.community}
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
    </section>
  );
}
