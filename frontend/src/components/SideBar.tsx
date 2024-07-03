import { useUserStore } from "@/store/userStore";
import { Button } from "@nextui-org/react";
import { RiHome6Fill as HomeIcon } from "react-icons/ri";
import { FaUserGroup as PeopleIcon } from "react-icons/fa6";
import { AiFillCode as LangIcon } from "react-icons/ai";
import { FaCode as CodeIcon } from "react-icons/fa6";
import { IoMdPerson as ProfileIcon } from "react-icons/io";
import { IoMdSettings as SettingsIcon } from "react-icons/io";
import { LuLogOut as LogoutIcon } from "react-icons/lu";
import { FaPlus as PlusIcon } from "react-icons/fa";
import { FaUserPlus as UserPlusIcon } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import JoinedCommunities from "./JoinedCommunities";
import { CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Card } from "@nextui-org/react";

export default function SideBar() {
  const { isLoggedIn, logoutUser, loginUser } = useUserStore();
  const router = useRouter();

  function handleLogout() {
    logoutUser();
  }

  // FIXME: add a better demo user
  function loginDemoUser() {
    loginUser({ email: "test@test.com", password: "test" });
  }

  // TODO: use https://nextui.org/docs/components/link#polymorphic-component this instead of router.push

  return (
    <aside className="hidden h-[87vh] min-w-80 pl-2 pr-10 pt-4 md:sticky md:top-20 md:block">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-2">
          {isLoggedIn && (
            <Button
              // variant="flat"
              className="mb-2 flex w-full justify-normal py-7 pl-14"
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
            radius="sm"
            color="primary"
            onClick={() => router.push("/")}
          >
            <HomeIcon className="ml-4 text-lg" />
            Home
          </Button>
          <Button
            variant="flat"
            className="flex w-full justify-normal"
            radius="sm"
            color="primary"
            onClick={() => router.push("/communities")}
          >
            <PeopleIcon className="ml-4 text-lg" />
            Communities
          </Button>
          <Button
            variant="flat"
            className="flex w-full justify-normal"
            radius="sm"
            color="primary"
            onClick={() => router.push("/languages")}
          >
            <LangIcon className="ml-4 text-lg" />
            Popular languages
          </Button>
          <Button
            variant="flat"
            className="flex w-full justify-normal"
            radius="sm"
            color="primary"
            onClick={() => router.push("/")}
          >
            <CodeIcon className="ml-4 text-lg" />
            Best snippets
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
          // FAQ page
          // Upvoted posts
          // Downvoted posts
          // saved posts

          <div className="flex flex-col gap-2">
            <Button
              variant="flat"
              className="flex w-full justify-normal"
              radius="sm"
              color="primary"
              onClick={() => router.push("/profile")}
            >
              <ProfileIcon className="ml-4 text-lg" />
              Profile
            </Button>
            <Button
              variant="flat"
              className="flex w-full justify-normal"
              radius="sm"
              color="primary"
              onClick={() => router.push("/")}
            >
              <SettingsIcon className="ml-4 text-lg" />
              Settings
            </Button>

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
        ) : (
          <Card className="max-w-80">
            <CardHeader>
              <CardTitle className="text-lg">
                Want to see the full app?
              </CardTitle>
              <CardDescription>
                Login to a demo account to get temporary access to all features
                of this app
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
