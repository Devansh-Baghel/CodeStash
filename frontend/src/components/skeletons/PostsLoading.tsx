import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cardLayout } from "@/utils/classnames";
import { Button } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/react";

export default function PostsLoading() {
  return (
    <>
      {[1, 2, 3, 4].map((_, index) => (
        <Card className={cn("mb-4", cardLayout)} key={index}>
          <CardHeader className="flex flex-row gap-4">
            <CardTitle>
              <Skeleton className="h-10 w-80 rounded-2xl" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 rounded-2xl" />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              color="primary"
              isLoading={true}
              // variant="flat"
              className="w-full rounded-[20px]"
            >
              Show code
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
