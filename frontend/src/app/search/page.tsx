"use client";

import PostItem from "@/components/PostItem";
import PostsLoading from "@/components/skeletons/PostsLoading";
import { cn } from "@/lib/utils";
import { PostTypes } from "@/types/postTypes";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { TbError404 as NotFoundIcon } from "react-icons/tb";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const {
    data: posts,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["search"],
    queryFn: () => {
      return fetcher.get("/posts/search", { params: { query } });
    },
    retry: 0,
  });
  const router = useRouter();

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  // TODO: better ui for search page when input empty
  if (!query) return "Search something here...";
  if (isError || !posts) return "Error";
  if (isLoading) return <PostsLoading items={2} />;

  if (posts.length === 0)
    return (
      <section className={cn(cardLayout)}>
        <h1 className="mb-4 text-2xl font-bold text-gray-600">
          Search results for: {query}
        </h1>
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <NotFoundIcon className="text-[200px] text-secondary" />
          <p>Currenly there are no posts for: {query}</p>
          <Button
            as={Link}
            href="/create-post"
            color="primary"
            className="drop-shadow-xl"
          >
            Create post
          </Button>
        </div>
      </section>
    );

  return (
    <section className={cn(cardLayout)}>
      <h1 className="mb-4 text-2xl font-bold text-gray-600">
        Search results for: {query}
      </h1>
      <div className="flex flex-col gap-8">
        {posts.map((post: PostTypes) => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
