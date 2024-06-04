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

export default function Hamburger() {
  return (
    <Sheet>
      <SheetTrigger>
        <MenuIcon className="h-10 w-10 text-primary md:hidden" />
      </SheetTrigger>
      <SheetOverlay />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>You aren&apos;t logged in</SheetTitle>
          <div className="flex flex-col gap-2">
            <Button variant="flat" radius="full">
              Login
            </Button>
            <Button variant="solid" radius="full" className="bg-primary">
              Sign up
            </Button>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
