"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useUserStore } from "@/store/userStore";
import { PostTypes } from "@/types/postTypes";
import fetcher from "@/utils/axios";
import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { cardLayout } from "@/utils/classnames";

export default function CommunityPosts({
  communityName,
}: {
  communityName: string;
}) {
  const { userData } = useUserStore();
  const { data, isError, isLoading } = useQuery<PostTypes[]>({
    queryKey: [`c/${communityName}/posts`],
    queryFn: async () => {
      return await fetcher.post("/posts/get-posts-by-community", {
        community: communityName,
      });
    },
  });

  const router = useRouter();

  if (isError) return "Error";
  if (isLoading)
    return <PostsLoading items={userData?.upvotedPosts.length || 4} />;

  if (data?.length === 0) {
    return (
      <PostsNotFound description="This community does not have any posts yet" />
    );
  }

  return (
    <section className={cn(cardLayout, "my-6")}>
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
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
