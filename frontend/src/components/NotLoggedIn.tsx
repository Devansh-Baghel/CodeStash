"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function NotLoggedIn({ description }: { description: string }) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="flex flex-col items-center">
        <Avatar src="" size="lg" className="mx-auto mb-6 h-32 w-32" />
        <CardTitle className="text-lg">You aren&apos;t logged in</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-2">
        <Button
          variant="flat"
          radius="full"
          color="primary"
          className="w-full max-w-80"
          onClick={() => {
            router.push("/login");
          }}
        >
          Login
        </Button>
        <Button
          variant="solid"
          radius="full"
          className="w-full max-w-80 bg-primary text-white"
          onClick={() => {
            router.push("/register");
          }}
        >
          Sign up
        </Button>
      </CardFooter>
    </Card>
  );
}
