import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { CommunityTypes } from '@/app/communities/page';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useUserStore } from '@/store/userStore';
import { Button } from '@nextui-org/react';

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
  const router = useRouter();

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
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <Link href={`c/${community.name}`}>
          <CardTitle className="mb-2 text-lg">c/{community.name}</CardTitle>
          <CardDescription>{community.description}</CardDescription>
        </Link>
        <div className="flex flex-col items-center">
          <p className="text-sm">{members} members</p>
          {hasJoinedCommunity ? (
            <Button
              color="danger"
              variant="flat"
              radius="md"
              onClick={() => handleLeaveAndJoin(community.name, "leave")}
            >
              - Leave community
            </Button>
          ) : (
            <Button
              color="primary"
              variant="flat"
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
      <CardFooter className="flex flex-col gap-2">
        <CardDescription>
          Community created by:{" "}
          <Link href={`u/${community.madeBy.username}`} className="underline">
            u/{community.madeBy.username}
          </Link>
        </CardDescription>
        <Button
          className="w-full"
          color="primary"
          onClick={() => router.push(`/c/${community.name}`)}
        >
          View Community
        </Button>
      </CardFooter>
    </Card>
  );
}
