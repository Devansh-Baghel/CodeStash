import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { cn } from "@/lib/utils";
import { cardLayout } from "@/utils/classnames";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function PostsNotFound({ description }: { description: string }) {
  const router = useRouter();

  return (
    <Card
      className={cn(
        cardLayout,
        "mt-4 flex flex-col items-center justify-center",
      )}
    >
      <CardHeader>
        <h1>{description}</h1>
      </CardHeader>
      <CardContent>
        <Button color="primary" onClick={() => router.push("/")}>
          Go to homepage
        </Button>
      </CardContent>
    </Card>
  );
}

export default PostsNotFound;
