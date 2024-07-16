"use client";

import { useRouter } from "next/navigation";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cardLayout } from "@/utils/classnames";
import { Avatar, Button } from "@nextui-org/react";

type PageProps = {
  description: string;
  title: string;
};

export default function NotLoggedIn({ description, title }: PageProps) {
  const router = useRouter();

  // TODO: add title also for each page take as a prop
  return (
    <section className={cn(cardLayout)}>
      <h1 className="mb-4 text-2xl font-bold text-gray-600">{title}</h1>
      <Card>
        <CardHeader className="flex flex-col items-center">
          <Avatar
            src="https://i.seadn.io/gcs/files/ccb8c81826526eb68f002bd3fabaa05c.png?auto=format&dpr=1&w=1000"
            size="lg"
            className="mx-auto mb-6 h-32 w-32"
          />
          <CardTitle className="text-lg">You aren&apos;t logged in</CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
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
    </section>
  );
}
