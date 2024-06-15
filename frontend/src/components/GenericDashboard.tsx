"use client";

import { Button } from "@nextui-org/react";
import { VscGitStash as CodeStashIcon } from "react-icons/vsc";
import Hamburger from "./Hamburger";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GenericDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { getCurrentUser } = useUserStore();

  // TODO: add Loading user data... screen like monkeytype
  // FIXME: only run this if accessToken and refreshToken exist
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <>
      <nav className="mb-6 flex items-center justify-between gap-2">
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
      </nav>
      {/* <aside></aside> */}
      {children}
    </>
  );
}
