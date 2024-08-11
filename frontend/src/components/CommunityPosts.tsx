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
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { PostTypes } from "@/types/postTypes";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

export default function CommunityPosts() {
  const { userData } = useUserStore();
  const { data, isError, isLoading } = useQuery<PostTypes[]>({
    queryKey: ["upvoted-posts"],
    queryFn: async () => {
      return await fetcher.get("/community/get-upvoted");
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
    <section className={cn(cardLayout)}>
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
              {/* TODO: Maybe add a remove from upvotes button here? */}
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
