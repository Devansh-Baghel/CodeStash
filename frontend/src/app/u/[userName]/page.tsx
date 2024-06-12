"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/store/userStore";
import fetcher from "@/utils/axios";
import { Avatar } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserProfile({
  params,
}: {
  params: { userName: string };
}) {
  const router = useRouter();
  const { userData } = useUserStore();
  const { data, isError, isLoading } = useQuery({
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
  });
  console.log(userData?.username);

  if (isError) return "Error";
  if (isLoading) return "Loading...";

  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-4">
        <Avatar src={data.avatar} size="lg" className="mx-auto h-32 w-32" />
        <CardTitle className="">{params.userName}</CardTitle>
        <CardDescription>
          {data.firstName} {data.lastName}
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex flex-col gap-2"></CardFooter>
    </Card>
  );
}
