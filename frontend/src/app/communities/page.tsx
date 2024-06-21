"use client";

import fetcher from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import CommunityItem from "@/components/CommunityItem";

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
      {data?.map((community) => <CommunityItem community={community} />)}
    </section>
  );
}
