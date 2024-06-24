import { useUserStore } from "@/store/userStore";
import { Button } from "@nextui-org/react";
import { RiHome6Fill as HomeIcon } from "react-icons/ri";
import { FaUserGroup as PeopleIcon } from "react-icons/fa6";
import { AiFillCode as LangIcon } from "react-icons/ai";
import { FaCode as CodeIcon } from "react-icons/fa6";
import { IoMdPerson as ProfileIcon } from "react-icons/io";
import { IoMdSettings as SettingsIcon } from "react-icons/io";
import { LuLogOut as LogoutIcon } from "react-icons/lu";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SideBar() {
  const { isLoggedIn, logoutUser } = useUserStore();
  const router = useRouter();

  function handleLogout() {
    logoutUser();
    router.push("/");
  }

  return (
    <aside className="hidden max-h-[87vh] min-w-80 pl-2 pr-10 pt-4 md:sticky md:top-20 md:block">
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

        {!isLoggedIn ? (
          // TODO: add ui here for not logged in user
          "not logged in"
        ) : (
          // FAQ page
          // Upvoted posts
          // Downvoted posts
          // saved posts

          <div className="flex flex-col gap-2">
            <Link href={"/"}>
              <Button
                variant="flat"
                className="flex w-full justify-normal"
                radius="sm"
                color="primary"
              >
                <ProfileIcon className="ml-4 text-lg" />
                Profile
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
                <SettingsIcon className="ml-4 text-lg" />
                Settings
              </Button>
            </Link>

            <Button
              variant="flat"
              className="flex w-full justify-normal hover:text-danger-500"
              radius="sm"
              color="primary"
              onClick={handleLogout}
            >
              <LogoutIcon className="ml-4 text-lg" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
