"use client";
// FIXME: Make this a seperate component later
import fetcher from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data, isError, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await fetcher.get("/posts/get-posts"),
  });

  if (isPending) return "Loading...";
  if (isError) return "Erorr";

  return (
    <div>
      {data.map((post) => (
        <div>{post.title}</div>
      ))}
    </div>
  );
}
