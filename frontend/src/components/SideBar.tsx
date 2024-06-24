import { useUserStore } from "@/store/userStore";
import { Button } from "@nextui-org/react";
import { RiHome6Fill as HomeIcon } from "react-icons/ri";
import { FaUserGroup as PeopleIcon } from "react-icons/fa6";
import { AiFillCode as LangIcon } from "react-icons/ai";
import { FaCode as CodeIcon } from "react-icons/fa6";

import Link from "next/link";

export default function SideBar() {
  const { isLoggedIn } = useUserStore();

  return (
    <aside className="hidden max-h-[85vh] min-w-80 pl-2 pr-10 pt-4 md:sticky md:top-20 md:block">
      {/* TODO: Add a expand button that bring the  */}
      {!isLoggedIn ? (
        <div className="flex flex-col gap-2">
          <Link href={"/"}>
            <Button
              variant="flat"
              className="flex w-full justify-normal"
              radius="sm"
              color="primary"
            >
              <HomeIcon className="ml-4 text-lg" />
              Home
            </Button>
          </Link>
          <Link href={"/communities"}>
            {" "}
            <Button
              variant="flat"
              className="flex w-full justify-normal"
              radius="sm"
              color="primary"
            >
              <PeopleIcon className="ml-4 text-lg" />
              Communities
            </Button>
          </Link>
          <Link href={"/"}>
            <Button
              variant="flat"
              className="flex w-full justify-normal"
              radius="sm"
              color="primary"
            >
              <LangIcon className="ml-4 text-lg" />
              Popular languages
            </Button>
          </Link>
          <Link href={"/"}>
            <Button
              variant="flat"
              className="flex w-full justify-normal"
              radius="sm"
              color="primary"
            >
              <CodeIcon className="ml-4 text-lg" />
              Best snippets
            </Button>
          </Link>
        </div>
      ) : (
        // Home
        // Popular langugages
        // Communities
        // Popular communities
        // FAQ page
        // Settings page
        // Profile
        // Logout
        // Upvoted posts
        // Downvoted posts
        // saved posts
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-2">
            <Link href={"/"}>
              <Button
                variant="flat"
                className="flex w-full justify-normal"
                radius="sm"
                color="primary"
              >
                <HomeIcon className="ml-4 text-lg" />
                Home
              </Button>
            </Link>
            <Link href={"/communities"}>
              {" "}
              <Button
                variant="flat"
                className="flex w-full justify-normal"
                radius="sm"
                color="primary"
              >
                <PeopleIcon className="ml-4 text-lg" />
                Communities
              </Button>
            </Link>
            <Link href={"/"}>
              <Button
                variant="flat"
                className="flex w-full justify-normal"
                radius="sm"
                color="primary"
              >
                <LangIcon className="ml-4 text-lg" />
                Popular languages
              </Button>
            </Link>
            <Link href={"/"}>
              <Button
                variant="flat"
                className="flex w-full justify-normal"
                radius="sm"
                color="primary"
              >
                <CodeIcon className="ml-4 text-lg" />
                Best snippets
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href={"/"}>
              <Button
                variant="flat"
                className="flex w-full justify-normal"
                radius="sm"
                color="primary"
              >
                <HomeIcon className="ml-4 text-lg" />
                Home
              </Button>
            </Link>
            <Link href={"/communities"}>
              {" "}
              <Button
                variant="flat"
                className="flex w-full justify-normal"
                radius="sm"
                color="primary"
              >
                <PeopleIcon className="ml-4 text-lg" />
                Communities
              </Button>
            </Link>
            <Link href={"/"}>
              <Button
                variant="flat"
                className="flex w-full justify-normal"
                radius="sm"
                color="primary"
              >
                <LangIcon className="ml-4 text-lg" />
                Popular languages
              </Button>
            </Link>
            <Link href={"/"}>
              <Button
                variant="flat"
                className="flex w-full justify-normal"
                radius="sm"
                color="primary"
              >
                <CodeIcon className="ml-4 text-lg" />
                Best snippets
              </Button>
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
