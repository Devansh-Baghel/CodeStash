"use client";

import PostsByUsername from "@/components/PostsByUsername";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { UserTypes } from "@/types/userTypes";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { Avatar } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, use } from "react";

export default function UserProfile(
  props: {
    params: Promise<{ userName: string }>;
  }
) {
  const params = use(props.params);
  const router = useRouter();
  const { userData } = useUserStore();
  const {
    data: user,
    isError,
    error,
    isLoading,
  } = useQuery<UserTypes>({
    queryKey: [params.userName],
    queryFn: async () => {
      return await fetcher.post("/users/get-user-profile", {
        username: params.userName,
      });
    },
  });

  useEffect(() => {
    if (params.userName === userData?.username) {
      router.push("/profile");
    }
  }, []);

  if (isLoading) return "Loading...";
  // TODO: user doesn't exist error
  if (isError || !user) {
    // @ts-expect-error
    if (error?.response?.status === 404) {
      console.log(error);
      // TODO: add a better error ui
      return "User doesn't exist";
    }
    return "Error";
  }

  return (
    <section className={cn(cardLayout)}>
      <h1 className="mb-4 text-2xl font-bold text-gray-600">
        Profile of <span className="underline">u/{user.username}</span>
      </h1>
      <Card className="mx-auto mb-8">
        <CardContent className="flex flex-col gap-10 p-10 sm:flex-row">
          {user?.avatar ? (
            <Link target="_blank" href={user?.avatar!}>
              <Avatar
                src={user?.avatar}
                size="lg"
                className="size-14 sm:size-20 lg:size-32"
              />
            </Link>
          ) : (
            <Avatar
              src={user?.avatar}
              size="lg"
              className="size-14 sm:size-20 lg:size-32"
            />
          )}
          <div>
            <h2 className="text-grey-900 text-2xl font-medium">
              {user.firstName} {user.lastName}
            </h2>
            <CardDescription className="mb-2">
              u/{user.username}
            </CardDescription>
            {/* TODO: replace these three lines with something better */}
            <h3>Upvoted Posts: {user.upvotedPosts.length}</h3>
            <h3>Downvoted Posts: {user.downvotedPosts.length}</h3>
          </div>
        </CardContent>
      </Card>
      {/* <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          size="lg"
          variant="underlined"
          color="primary"
        >
          <Tab key="your-posts" title="Your Posts">
            <UserPosts />
          </Tab>
          <Tab key="upvoted" title="Upvoted Posts">
            <UpvotedPosts hasTitle={false} />
          </Tab>
          <Tab key="downvoted" title="Downvoted Posts">
            <DownvotedPosts hasTitle={false} />
          </Tab>
        </Tabs>
      </div> */}
      <PostsByUsername username={user.username} />
    </section>
  );
}
