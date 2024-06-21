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
import fetcher from "@/utils/axios";

export default function CommunityItem({
  community,
}: {
  community: CommunityTypes;
}) {
  const { userData, isLoggedIn } = useUserStore();
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState(
    userData?.communitiesJoined.includes(community.name),
  );

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
    <Card key={community._id}>
      <CardHeader className="flex flex-row items-center justify-between">
        <Link href={`c/${community.name}`}>
          <CardTitle className="mb-2 text-lg">c/{community.name}</CardTitle>
          <CardDescription>{community.description}</CardDescription>
        </Link>
        <div className="flex flex-col items-center">
          <p className="text-sm">{community.joinedMembers} members</p>
          {hasJoinedCommunity ? (
            <Button
              color="primary"
              variant="flat"
              radius="md"
              //   onClick={() => joinCommunity(community.name)}
            >
              - Leave community
            </Button>
          ) : (
            <Button
              color="primary"
              radius="md"
              onClick={() => joinCommunity(community.name)}
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
