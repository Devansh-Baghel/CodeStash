"use client";

import { CommunityTypes } from "@/app/communities/page";
import CommunityPosts from "@/components/CommunityPosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { Avatar, Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page({ params }: { params: { community: string } }) {
  const { userData, isLoggedIn, joinCommunity, leaveCommunity } =
    useUserStore();
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState(
    userData?.communitiesJoined.includes(params.community),
  );
  const [members, setMembers] = useState(0);
  const { data, isLoading, isError } = useQuery<CommunityTypes>({
    queryKey: [`c/${params.community}`],
    queryFn: () => {
      // TODO: if community does not exist, show error page.
      return fetcher
        .post("/community/get-community", {
          name: params.community,
        })
        .then((res) => {
          setMembers(res.joinedMembers);
          return res;
        });
    },
  });

  // FIXME: Loading screen here
  if (isLoading) return "Loading...";
  if (isError || !data) return "Error";

  function handleLeaveAndJoin(name: string, action: "join" | "leave") {
    if (!name) return;
    if (!isLoggedIn) {
      toast.error("You need to be logged in to join/leave a community");
      return;
    }

    if (action === "join") {
      joinCommunity(name);
      setHasJoinedCommunity(true);
      setMembers((count) => count + 1);
    } else {
      leaveCommunity(name);
      setHasJoinedCommunity(false);
      setMembers((count) => count - 1);
    }
  }

  return (
    <>
      <section className={cn(cardLayout)}>
        {data.coverImage && (
          <img
            src={data.coverImage}
            alt={`Cover image of c/${data.name}`}
            className="-mb-4 max-h-40 w-full rounded-xl drop-shadow-lg"
          />
        )}
        <Card className="border-t-5 border-primary">
          <CardHeader className="flex flex-row justify-between">
            <div className="ml-1 flex gap-4">
              <Avatar
                src={data.avatar}
                className="h-20 w-20"
                name={data.name}
                size="lg"
              />
              <div>
                <h1 className="text-xl font-semibold">c/{data.name}</h1>
                <p className="">{data.description}</p>
              </div>
            </div>
            {hasJoinedCommunity ? (
              <Button
                color="danger"
                variant="flat"
                radius="md"
                onClick={() => handleLeaveAndJoin(data.name, "leave")}
              >
                - Leave community
              </Button>
            ) : (
              <Button
                color="primary"
                variant="flat"
                radius="md"
                onClick={() => handleLeaveAndJoin(data.name, "join")}
              >
                + Join community
              </Button>
            )}
          </CardHeader>
          <CardContent className="pb-3 text-center text-sm">
            <p>
              {members} {members === 1 ? "member" : "members"}
            </p>
            <p>
              community created by{" "}
              <Link
                href={`/u/${data.madeBy.username}`}
                className="text-primary underline"
              >
                c/{data.madeBy.username}
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
      <CommunityPosts communityName={data.name} />
    </>
  );
}
