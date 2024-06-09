"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@nextui-org/react";
import { IoMenu as MenuIcon } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Hamburger() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <MenuIcon className="h-10 w-10 text-primary md:hidden" />
      </SheetTrigger>
      <SheetOverlay />
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
    </Sheet>
  );
}
