import { useRouter } from "next/navigation";
import {
  BiSolidDownvote as SolidDownvoteIcon,
  BiSolidUpvote as SolidUpvoteIcon,
} from "react-icons/bi";
import { FaBookmark as SaveIcon } from "react-icons/fa";
import {
  IoMdPerson as ProfileIcon,
  IoMdSettings as SettingsIcon,
} from "react-icons/io";

import { useUserStore } from "@/store/userStore";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Avatar, Button } from "@nextui-org/react";

import { CardDescription } from "./ui/card";

export default function () {
  const { userData } = useUserStore();
  const router = useRouter();

  return (
    <Card
      className="sticky top-20 z-50 mr-0 hidden max-h-[85vh] w-full max-w-80 p-4 lg:block"
      shadow="sm"
    >
      <CardHeader className="flex flex-col text-center">
        <Avatar src="" className="mx-auto mb-4 h-28 w-28" />
        <h1 className="text-xl">
          {userData?.firstName} {userData?.lastName}
        </h1>
        <CardDescription>u/{userData?.username}</CardDescription>
      </CardHeader>
      <CardBody className="flex w-full flex-col items-center gap-1.5">
        <Button
          variant="solid"
          radius="full"
          color="primary"
          className="flex w-full justify-normal"
          onClick={() => {
            router.push("/profile");
          }}
        >
          <ProfileIcon className="ml-12 h-5 w-5" />
          Show profile
        </Button>

        <Button
          variant="flat"
          radius="md"
          size="md"
          color="primary"
          className="flex w-full justify-normal pl-8"
          onClick={() => {
            router.push("/saved");
          }}
        >
          <SaveIcon />
          Saved Posts
        </Button>

        <Button
          variant="flat"
          radius="md"
          size="md"
          color="primary"
          className="flex w-full justify-normal pl-8"
          onClick={() => {
            router.push("/upvoted");
          }}
        >
          <SolidUpvoteIcon />
          Upvoted Posts
        </Button>

        <Button
          variant="flat"
          size="md"
          radius="md"
          color="primary"
          className="flex w-full justify-normal pl-8"
          onClick={() => {
            router.push("/downvoted");
          }}
        >
          <SolidDownvoteIcon />
          Downvoted Posts
        </Button>
      </CardBody>
      <CardFooter className="absolute bottom-0 left-0 right-0 px-7 pb-4">
        <Button
          variant="flat"
          className="flex w-full justify-normal"
          radius="md"
          color="primary"
          onClick={() => router.push("/settings")}
        >
          <SettingsIcon className="ml-4 text-lg" />
          Account Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
