import { Button } from "@nextui-org/react";
import { VscGitStash as CodeStashIcon } from "react-icons/vsc";
import Hamburger from "./Hamburger";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

// TODO: Make this navbar fixed at the top of the screen all the time
export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn } = useUserStore();

  return (
    <nav className="sticky top-0 z-50 mt-[-1rem] flex items-center justify-between bg-background pb-6 pt-4">
      <Button
        className="flex gap-2 font-bold text-primary"
        radius="full"
        variant="light"
        onClick={() => router.push("/")}
      >
        <CodeStashIcon className="h-8 w-8" />
        <h2 className="mt-1 text-xl font-semibold">CodeStash</h2>
      </Button>
      <Hamburger />

      {isLoggedIn ? (
        // TODO: when user is logged in show them their user icon which opens a menu for lots of actions like reddit does when logged in.
        <div className="hidden gap-2 sm:flex">
          <Button
            variant="solid"
            radius="full"
            className="bg-primary text-white"
            onClick={() => {
              router.push("/profile");
            }}
          >
            Show profile
          </Button>

          <Button
            variant="flat"
            radius="full"
            color="primary"
            onClick={() => {
              router.push("/saved");
            }}
          >
            Saved Posts
          </Button>
        </div>
      ) : (
        <div className="hidden gap-2 sm:flex">
          <Button
            variant="flat"
            color="primary"
            radius="full"
            onClick={() => {
              router.push("/login");
            }}
          >
            Login
          </Button>
          <Button
            variant="solid"
            radius="full"
            className="bg-primary text-white"
            onClick={() => {
              router.push("/register");
            }}
          >
            Sign up
          </Button>
        </div>
      )}
    </nav>
  );
}
