"use client";

import { FaPlus as PlusIcon } from "react-icons/fa";
import CommunityItem from "@/components/CommunityItem";
import CommunitiesSkeleton from "@/components/skeletons/CommunitiesSkeleton";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import useTitle from "@/hooks/useTitle";
import Link from "next/link";

export type CommunityTypes = {
  madeBy: {
    userId: string;
    username: string;
  };
  _id: string;
  name: string;
  description: string;
  joinedMembers: number;
  avatar: string;
  coverImage: string;
};

export default function Communities() {
  // TODO: add community types
  useTitle("Communities");
  const { data, isLoading, isError } = useQuery<CommunityTypes[]>({
    queryKey: ["communities"],
    queryFn: async () => {
      return await fetcher.get("/community/get-all");
    },
  });
  const { isLoggedIn } = useUserStore();

  if (isError) return "Error";
  if (isLoading) return <CommunitiesSkeleton />;

  return (
    <section className={cn(cardLayout, "flex flex-col gap-4")}>
      <h1 className="text-2xl font-bold text-gray-600">Communities</h1>
      {isLoggedIn && (
        <>
          <Button
            color="primary"
            className="h-14 text-lg"
            variant="flat"
            as={Link}
            href="/create-community"
          >
            <PlusIcon />
            Create your own community
          </Button>
          <p className="text-grey-700 text-center text-sm">Or join one below</p>
        </>
      )}
      {data?.map((community) => (
        <CommunityItem community={community} key={community._id} />
      ))}
    </section>
  );
}
