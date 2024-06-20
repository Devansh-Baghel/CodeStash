"use client";

import fetcher from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { PostTypes } from "@/types/postTypes";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Post from "./Post";

export default function Posts() {
  const searchParams = useSearchParams();
  const language = searchParams.get("language");

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
    // @ts-ignore
    if (error?.response?.status === 404) {
      // TODO: add better looking ui for not supported language
      return "This language isn't supported yet";
    }
    return "error";
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((post) => (
        <Post post={post} />
      ))}
    </div>
  );
}
