"use client";

import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { PostTypes } from "@/types/postTypes";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { Button, Card, Pagination } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TbError404 as NotFoundIcon } from "react-icons/tb";
import PostItem from "./PostItem";
import PostsLoading from "./skeletons/PostsLoading";
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function Posts() {
  const searchParams = useSearchParams();
  const language = searchParams.get("language");
  const router = useRouter();
  const page = parseInt(searchParams.get("page") || "1");
  const { loginUser, isLoggedIn } = useUserStore();

  const { data, isError, isPending, error } = useQuery<{
    posts: PostTypes[];
    totalPages: number;
    totalPosts: number;
    currentPage: number;
  }>({
    queryKey: ["posts", page],
    queryFn: () => {
      if (!language) {
        return fetcher.get(`/posts/get-posts?page=${page}`);
      } else {
        return fetcher.post("/posts/get-posts-by-language", { language });
      }
    },
  });

  if (isPending) return <PostsLoading />;
  if (isError) {
    // FIXME: fix ts error
    // @ts-ignore
    if (error?.response?.status === 404) {
      // TODO: add better looking ui for not supported language
      return "This language isn't supported yet";
    }
    return "error";
  }

  return (
    <div className={cn(cardLayout, "flex flex-col gap-8")}>
      {!isLoggedIn && (
        <Card className="md:hidden">
          <CardHeader>
            <CardTitle className="text-lg">Want to see the full app?</CardTitle>
            <CardDescription>
              Login to a demo account to get access to all features of this app
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <Button
              color="primary"
              className="w-full"
              onClick={() =>
                loginUser({
                  email: "test@test.com",
                  password: process.env.NEXT_PUBLIC_DEMO_PASS!,
                })
              }
            >
              Login as a demo user
            </Button>
          </CardContent>
        </Card>
      )}
      <h1 className="-mb-4 text-2xl font-bold text-gray-600">
        {language ? `Posts written in ${language}` : "All Posts"}
      </h1>
      {data.posts.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <NotFoundIcon className="text-[200px] text-secondary" />
          <p>Currenly there are no posts for {language}</p>
          <Button
            as={Link}
            href={`/create-post?language=${language}`}
            color="primary"
            className="drop-shadow-xl"
          >
            Create post in {language}
          </Button>
        </div>
      ) : (
        <>
          {data.posts.map((post) => (
            <PostItem post={post} key={post._id} />
          ))}
          <Pagination
            total={data.totalPages}
            showControls
            page={page}
            className="mx-auto"
            onChange={(page) => {
              if (language) {
                router.push(`?language=${language}&page=${page}`);
              } else {
                router.push(`?page=${page}`);
              }
            }}
          />
        </>
      )}
    </div>
  );
}
