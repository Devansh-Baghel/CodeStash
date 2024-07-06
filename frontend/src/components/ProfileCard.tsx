import { useUserStore } from "@/store/userStore";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Avatar, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { BiSolidUpvote as SolidUpvoteIcon } from "react-icons/bi";
import { BiSolidDownvote as SolidDownvoteIcon } from "react-icons/bi";
import { FaBookmark as SaveIcon } from "react-icons/fa";
import { IoMdPerson as ProfileIcon } from "react-icons/io";
import { CardDescription } from "./ui/card";
import { IoMdSettings as SettingsIcon } from "react-icons/io";

export default function () {
  const { userData } = useUserStore();
  const router = useRouter();

  return (
    <Card className="sticky top-20 z-50 mr-4 hidden max-h-[85vh] w-full max-w-80 p-6 lg:block">
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
        <Button
          variant="flat"
          className="mt-24 flex w-full justify-normal"
          radius="md"
          color="primary"
          onClick={() => router.push("/")}
        >
          <SettingsIcon className="ml-4 text-lg" />
          Account Settings
        </Button>
      </CardBody>
    </Card>
  );
}
