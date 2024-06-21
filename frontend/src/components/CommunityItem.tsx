import { CommunityTypes } from "@/app/communities/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { toast } from "@/components/ui/use-toast";

export default function CommunityItem({
  community,
}: {
  community: CommunityTypes;
}) {
  const { userData, isLoggedIn, joinCommunity, leaveCommunity } =
    useUserStore();
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState(
    userData?.communitiesJoined.includes(community.name),
  );
  const [members, setMembers] = useState(community.joinedMembers);

  function handleLeaveAndJoin(name: string, action: "join" | "leave") {
    if (!name) return;
    if (!isLoggedIn) {
      toast({
        description: "You need to be logged in to join/leave a community",
      });
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
    <Card key={community._id}>
      <CardHeader className="flex flex-row items-center justify-between">
        <Link href={`c/${community.name}`}>
          <CardTitle className="mb-2 text-lg">c/{community.name}</CardTitle>
          <CardDescription>{community.description}</CardDescription>
        </Link>
        <div className="flex flex-col items-center">
          <p className="text-sm">{members} members</p>
          {hasJoinedCommunity ? (
            <Button
              color="primary"
              variant="flat"
              radius="md"
              onClick={() => handleLeaveAndJoin(community.name, "leave")}
            >
              - Leave community
            </Button>
          ) : (
            <Button
              color="primary"
              radius="md"
              onClick={() => handleLeaveAndJoin(community.name, "join")}
            >
              + Join community
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* TODO: add community cover image and avatar here */}
      </CardContent>
      <CardFooter>
        <CardDescription>
          Community created by:{" "}
          <Link href={`u/${community.madeBy.username}`} className="underline">
            u/{community.madeBy.username}
          </Link>
        </CardDescription>
      </CardFooter>
    </Card>
  );
}