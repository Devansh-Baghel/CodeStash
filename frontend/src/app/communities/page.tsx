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
import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
// import { RiGroupFill as GroupIcon } from "react-icons/ri";
import { Divider } from "@nextui-org/divider";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export type CommunityTypes = {
  madeBy: {
    userId: string;
    username: string;
  };
  _id: string;
  name: string;
  description: string;
  joinedMembers: number;
};

export default function Communities() {
  // TODO: add community types
  const { data, isLoading, isError } = useQuery<CommunityTypes[]>({
    queryKey: ["communities"],
    queryFn: async () => {
      return await fetcher.get("/community/get-all");
    },
  });
  const { isLoggedIn } = useUserStore();
  const router = useRouter();

  if (isError) return "Error";
  if (isLoading) return "Loading...";

  function joinCommunity(name: string) {
    if (!name) return;
    if (!isLoggedIn) {
      toast({
        description: "You need to be logged in to join a community",
      });
      return;
    }

    fetcher.post("/community/join", { community: name }).then((res) => {
      console.log(res);
    });
  }

  return (
    <section className="flex flex-col gap-4">
      {isLoggedIn && (
        <>
          <Button
            color="primary"
            className="h-14 text-lg"
            variant="flat"
            onClick={() => router.push("/create-community")}
          >
            {/* <GroupIcon /> */}
            Create your own community
          </Button>
          <p className="text-grey-700 text-center text-sm">Or join one below</p>
        </>
      )}
      {data?.map((community) => (
        <Card key={community._id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <Link href={`c/${community.name}`}>
              <CardTitle className="mb-2 text-lg">c/{community.name}</CardTitle>
              <CardDescription>{community.description}</CardDescription>
            </Link>
            <div className="flex flex-col items-center">
              <p className="text-sm">{community.joinedMembers} members</p>
              <Button
                color="primary"
                radius="md"
                onClick={() => joinCommunity(community.name)}
              >
                + Join community
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* TODO: add community cover image and avatar here */}
          </CardContent>
          <CardFooter>
            <CardDescription>
              Community created by:{" "}
              <Link
                href={`u/${community.madeBy.username}`}
                className="underline"
              >
                u/{community.madeBy.username}
              </Link>
            </CardDescription>
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}
