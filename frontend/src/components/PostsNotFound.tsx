import { useRouter } from "next/navigation";
import React from "react";

import { cn } from "@/lib/utils";
import { cardLayout } from "@/utils/classnames";
import { Button } from "@heroui/react";

import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";

function PostsNotFound({ description }: { description: string }) {
  const router = useRouter();

  return (
    <Card
      className={cn(
        cardLayout,
        "mt-4 flex flex-col items-center justify-center",
      )}
    >
      {/* TODO: add an icon/svg here for no saved/downvoted/upvoted posts */}
      <CardHeader>
        <h1>{description}</h1>
      </CardHeader>
      <CardContent>
        <Button color="primary" as={Link} href="/">
          Go to homepage
        </Button>
      </CardContent>
    </Card>
  );
}

export default PostsNotFound;
