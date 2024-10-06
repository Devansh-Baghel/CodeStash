"use client";

import { CommunityTypes } from "@/app/communities/page";
import CommunityOptionsModal from "@/components/CommunityOptionsModal";
import CommunityPosts from "@/components/CommunityPosts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UploadAvatar from "@/components/UploadAvatar";
import UploadCoverImage from "@/components/UploadCoverImage";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { Avatar, Button, Tab, Tabs } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus as PlusIcon } from "react-icons/fa";

export type FilterTypes = "Latest" | "Oldest" | "Popular";

const filters: { name: FilterTypes }[] = [
  { name: "Popular" },
  { name: "Latest" },
  { name: "Oldest" },
];

export default function Page({ params }: { params: { community: string } }) {
  const { userData, isLoggedIn, joinCommunity, leaveCommunity } =
    useUserStore();
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState(
    userData?.communitiesJoined.includes(params.community),
  );
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useQuery<CommunityTypes>({
    queryKey: [`c/${params.community}`],
    queryFn: () => {
      // TODO: if community does not exist, show error page.
      return fetcher
        .post("/community/get-community", {
          name: params.community,
        })
        .then((res) => {
          setMembers(res.joinedMembers);
          setDescription(res.description);
          return res;
        });
    },
  });
  const [members, setMembers] = useState(data?.joinedMembers || 0);
  const [description, setDescription] = useState(data?.description || "");

  if (params.community === "all") router.push("/");

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
      <section className={cn(cardLayout, "mb-6")}>
        {data.coverImage && (
          <img
            src={data.coverImage}
            alt={`Cover image of c/${data.name}`}
            className="-mb-4 aspect-[4/1] w-full rounded-xl drop-shadow-lg"
          />
        )}
        <Card className="border-t-5 border-primary">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
            <div className="ml-1 flex gap-4">
              <Avatar
                src={data.avatar}
                className="h-20 w-20"
                name={data.name}
                size="lg"
              />
              <div>
                <h1 className="text-xl font-semibold">c/{data.name}</h1>
                <p className="max-w-96">{description}</p>
              </div>
            </div>
            {hasJoinedCommunity ? (
              <Button
                color="primary"
                radius="full"
                as={Link}
                href={`/create-post?community=${data.name}`}
              >
                <PlusIcon className="" />
                Create Post in c/{data.name}
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
          <CardContent>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              {hasJoinedCommunity && (
                <Button
                  color="danger"
                  variant="flat"
                  radius="md"
                  size="sm"
                  onClick={() => handleLeaveAndJoin(data.name, "leave")}
                >
                  - Leave community
                </Button>
              )}

              {data.madeBy.username === userData?.username &&
                hasJoinedCommunity && (
                  <>
                    <CommunityOptionsModal
                      community={data}
                      description={description}
                      setDescription={setDescription}
                    />
                    <UploadAvatar
                      buttonText={
                        userData?.avatar ? "Update avatar" : "Upload avatar"
                      }
                      type="community"
                      communityName={data.name}
                      refetch={refetch}
                    />
                    <UploadCoverImage
                      buttonText={
                        data.coverImage
                          ? "Update cover image"
                          : "Upload cover image"
                      }
                      communityName={data.name}
                      refetch={refetch}
                    />
                  </>
                )}
            </div>
            <div className="-mb-2 text-center text-sm">
              <p>
                {members} {members === 1 ? "member" : "members"}
              </p>
              <p>
                community created by{" "}
                <Link
                  href={`/u/${data.madeBy.username}`}
                  className="text-primary underline"
                >
                  u/{data.madeBy.username}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
      <Tabs
        aria-label="Dynamic tabs"
        items={filters}
        defaultSelectedKey={"Latest"}
        color="primary"
        variant="underlined"
        size="lg"
      >
        {(item) => (
          <Tab key={item.name} title={item.name}>
            <CommunityPosts communityName={data.name} filter={item.name} />
          </Tab>
        )}
      </Tabs>
    </>
  );
}
