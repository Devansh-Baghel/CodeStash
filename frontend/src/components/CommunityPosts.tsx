"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { cardLayout } from "@/utils/classnames";
import { FilterTypes } from "@/app/c/[community]/page";

export default function CommunityPosts({
  communityName,
  filter,
}: {
  communityName: string;
  filter: FilterTypes;
}) {
  const { userData } = useUserStore();
  const { data, isError, isLoading, isRefetching } = useQuery<PostTypes[]>({
    queryKey: [`c/${communityName}/posts - ${filter}`],
    queryFn: async () => {
      return await fetcher.post("/posts/get-posts-by-community", {
        community: communityName,
        filter,
      });
    },
  });

  const router = useRouter();

  if (isError) return "Error";
  if (isLoading || isRefetching)
    return <PostsLoading items={userData?.upvotedPosts.length || 4} />;

  if (data?.length === 0) {
    return (
      <Card
        className={cn(
          cardLayout,
          "mt-4 flex flex-col items-center justify-center",
        )}
      >
        {/* TODO: add an icon/svg here for no saved/downvoted/upvoted posts */}
        <CardHeader>
          <p className="">
            This community does not have any posts yet, <br /> be the first one
            to create a post in c/{communityName}!
          </p>
        </CardHeader>
        <CardContent>
          <Button
            color="primary"
            as={Link}
            href={`/create-post?community=${communityName}`}
          >
            create post in c/{communityName}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className={cn(cardLayout, "mb-6 mt-2")}>
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
                as={Link}
                href={`/post/${post._id}`}
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
