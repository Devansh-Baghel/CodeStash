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
import Link from "next/link";

export default function ProfileCard() {
  const { userData } = useUserStore();

  return (
    <Card
      className="sticky top-20 z-50 mr-0 hidden max-h-[85vh] w-full max-w-72 p-4 lg:block"
      shadow="sm"
    >
      <CardHeader className="flex flex-col text-center">
        <Link target="_blank" href={userData?.avatar!}>
          <Avatar src={userData?.avatar} className="mx-auto mb-4 h-28 w-28" />
        </Link>
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
          as={Link}
          href="/profile"
        >
          <ProfileIcon className="ml-6 size-5" />
          Show profile
        </Button>

        <Button
          variant="flat"
          radius="md"
          size="md"
          color="primary"
          className="flex w-full justify-normal pl-8"
          as={Link}
          href="/saved"
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
          as={Link}
          href="/upvoted"
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
          as={Link}
          href="/downvoted"
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
          as={Link}
          href="/settings"
        >
          <SettingsIcon className="ml-4 text-lg" />
          Account Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
