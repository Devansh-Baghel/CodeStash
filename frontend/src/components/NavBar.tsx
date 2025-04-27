import { useUserStore } from "@/store/userStore";
import { Button } from "@heroui/react";
import Link from "next/link";
import { VscGitStash as CodeStashIcon } from "react-icons/vsc";
import AvatarDropdown from "./AvatarDropdown";
import Hamburger from "./Hamburger";
import SearchBar from "./SearchBar";

// TODO: Make this navbar fixed at the top of the screen all the time
export default function Navbar() {
  const { isLoggedIn } = useUserStore();

  return (
    (<nav className="sticky top-0 z-50 mt-[-1rem] flex items-center justify-between bg-background pb-6 pt-4">
      <Button
        className="flex gap-2 font-bold text-primary"
        radius="full"
        variant="light"
        as={Link}
        href="/"
      >
        <CodeStashIcon className="h-8 w-8" />
        <h2 className="mt-1 text-xl font-semibold">CodeStash</h2>
      </Button>
      <Hamburger />
      <SearchBar />
      {isLoggedIn ? (
        // TODO: when user is logged in show them their user icon which opens a menu for lots of actions like reddit does when logged in.
        (<div className="hidden sm:flex">
          <AvatarDropdown />
        </div>)
      ) : (
        <div className="hidden gap-2 sm:flex">
          <Button
            variant="flat"
            color="primary"
            radius="full"
            as={Link}
            href="/login"
          >
            Login
          </Button>
          <Button
            variant="solid"
            radius="full"
            className="bg-primary text-white"
            as={Link}
            href="/register"
          >
            Sign up
          </Button>
        </div>
      )}
    </nav>)
  );
}
