"use client";

import fetcher from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export default function Comments({ postId }: { postId: string }) {
  const {data, isError, isLoading} = useQuery({
    queryKey: [`${postId}/comments`],
    queryFn: async () => {
      return await fetcher.post("/comments/get-comments", { postId });
    },
  });

  if (isError) return "Error"
  if (isLoading) return "Loading..."

  console.log(data)
}
