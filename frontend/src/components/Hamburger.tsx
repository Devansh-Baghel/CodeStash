"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@nextui-org/react";
import { IoMenu as MenuIcon } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { Avatar } from "@nextui-org/react";
import { LuLogOut as LogoutIcon } from "react-icons/lu";

export default function Hamburger() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, userData, logoutUser } = useUserStore();
  const router = useRouter();

  function handleLogout() {
    logoutUser();
    router.push("/");
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <MenuIcon className="h-10 w-10 text-primary md:hidden" />
      </SheetTrigger>
      <SheetOverlay />

      {isLoggedIn ? (
        <SheetContent className="jusity-between flex h-full flex-col">
          <SheetHeader>
            <Avatar src="" size="lg" className="mx-auto h-32 w-32" />
            <SheetTitle>
              {userData?.firstName} {userData?.lastName}
            </SheetTitle>

            <Button
              variant="solid"
              radius="full"
              className="bg-primary text-white"
              onClick={() => {
                router.push("/profile");
                setOpen(false);
              }}
            >
              Show profile
            </Button>
          </SheetHeader>

          {/* FIXME: Temporary spacer */}
          <div className="flex-1"></div>

          <SheetFooter>
            <Button
              variant="ghost"
              radius="full"
              color="primary"
              className="font-semibold"
              onClick={handleLogout}
            >
              Logout
              <LogoutIcon className="h-4 w-4" />
            </Button>
          </SheetFooter>
        </SheetContent>
      ) : (
        <SheetContent>
          <SheetHeader>
            <SheetTitle>You aren&apos;t logged in</SheetTitle>
            <div className="flex flex-col gap-2">
              <Button
                variant="flat"
                radius="full"
                onClick={() => {
                  router.push("/login");
                  setOpen(false);
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
                  setOpen(false);
                }}
              >
                Sign up
              </Button>
            </div>
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
}
