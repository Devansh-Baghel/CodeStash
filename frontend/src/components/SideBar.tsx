import { useRouter } from "next/navigation";
import { AiFillCode as LangIcon } from "react-icons/ai";
import { FaPlus as PlusIcon } from "react-icons/fa";
import {
  FaUserGroup as PeopleIcon,
  FaUserPlus as UserPlusIcon,
} from "react-icons/fa6";
import { LuLogOut as LogoutIcon } from "react-icons/lu";
import { RiHome6Fill as HomeIcon } from "react-icons/ri";
import { useUserStore } from "@/store/userStore";
import { Button, Card } from "@nextui-org/react";

import JoinedCommunities from "./JoinedCommunities";
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function SideBar() {
  const { isLoggedIn, logoutUser, loginUser } = useUserStore();
  const router = useRouter();

  // FIXME: add a better demo user
  function loginDemoUser() {
    loginUser({ email: "test@test.com", password: "test" });
  }

  return (
    <aside className="hidden h-[85vh] min-w-80 pl-2 pr-10 md:sticky md:top-20 md:block">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-1.5">
          {isLoggedIn && (
            <Button
              className="mb-2 flex w-full justify-normal py-4 pl-14 drop-shadow-md 2xl:py-7"
              radius="full"
              size="lg"
              color="primary"
              onClick={() => router.push("/create-post")}
            >
              <PlusIcon className="ml-4 text-lg" />
              Create Post
            </Button>
          )}
          <Button
            variant="flat"
            className="flex w-full justify-normal"
            radius="md"
            color="primary"
            onClick={() => router.push("/")}
          >
            <HomeIcon className="ml-4 text-lg" />
            Home
          </Button>
          <Button
            variant="flat"
            className="flex w-full justify-normal"
            radius="md"
            color="primary"
            onClick={() => router.push("/communities")}
          >
            <PeopleIcon className="ml-4 text-lg" />
            Communities
          </Button>
          <Button
            variant="flat"
            className="flex w-full justify-normal"
            radius="md"
            color="primary"
            onClick={() => router.push("/languages")}
          >
            <LangIcon className="ml-4 text-lg" />
            Popular languages
          </Button>
          {isLoggedIn && (
            <>
              <Button
                variant="flat"
                color="primary"
                className="flex w-full justify-normal"
                aria-label="create community"
                onClick={() => router.push("/create-community")}
              >
                <UserPlusIcon className="ml-4 text-lg" />
                Create Community
              </Button>
              <JoinedCommunities />
            </>
          )}
        </div>

        {/* // TODO: add ui here for not logged in user */}
        {isLoggedIn ? (
          <Button
            variant="flat"
            className="flex w-full justify-normal hover:text-danger-500"
            radius="md"
            color="primary"
            onClick={logoutUser}
          >
            <LogoutIcon className="ml-4 text-lg" />
            Logout
          </Button>
        ) : (
          <Card className="max-w-80">
            <CardHeader>
              <CardTitle className="text-lg">
                Want to see the full app?
              </CardTitle>
              <CardDescription>
                Login to a demo account to get access to all features of this
                app
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <Button
                color="primary"
                className="w-full"
                onClick={loginDemoUser}
              >
                Login as a demo user
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </aside>
  );
}
