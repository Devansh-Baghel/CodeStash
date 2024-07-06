"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { TbError404 as NotFoundIcon } from "react-icons/tb";

import { cn } from "@/lib/utils";
import { PostTypes } from "@/types/postTypes";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

import PostItem from "./PostItem";
import PostsLoading from "./skeletons/PostsLoading";

export default function Posts() {
  const searchParams = useSearchParams();
  const language = searchParams.get("language");
  const router = useRouter();

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
    staleTime: 0,
  });

  // This is cause when user clicks on homepage icon to go to / , then it refetches the query
  // useEffect(() => {
  //   refetch();
  // }, [refetch, searchParams]);

  if (isPending || isRefetching) return <PostsLoading />;
  if (isError || isRefetchError) {
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
      {data.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <NotFoundIcon className="text-[200px] text-secondary" />
          <p>Currenly there are no posts for {language}</p>
          <Button
            onClick={() => router.push(`/create-post?language=${language}`)}
            color="primary"
            className="drop-shadow-xl"
          >
            Create post in {language}
          </Button>
        </div>
      ) : (
        data.map((post) => <PostItem post={post} key={post._id} />)
      )}
    </div>
  );
}
