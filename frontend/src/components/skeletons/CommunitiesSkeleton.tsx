import { cn } from "@/lib/utils";
import { cardLayout } from "@/utils/classnames";
import { Button, Skeleton } from "@heroui/react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function CommunitiesSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card className={cn("mb-4", cardLayout)} key={index}>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-10 rounded-2xl" />
              <Skeleton className="mt-3 h-4 w-52 rounded-sm" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 rounded-2xl" />
          </CardContent>
          <CardFooter>
            <Button color="primary" isLoading className="w-full">
              View Community
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
