"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import fetcher from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export default function () {
  // TODO: add community types
  const { data, isLoading, isError } = useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      return await fetcher.get("/community/get-all");
    },
  });

  if (isError) return "Error";
  if (isLoading) return "Loading...";

  console.log(data);

  return (
    <>
      {data.map((community) => (
        <Card key={community._id}>
          <CardHeader>{community.name}</CardHeader>
        </Card>
      ))}
    </>
  );
}
