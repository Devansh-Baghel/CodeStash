import { BiUpvote as UpvoteIcon } from "react-icons/bi";
import { BiDownvote as DownvoteIcon } from "react-icons/bi";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, Skeleton } from "@nextui-org/react";

export default function PostsLoading() {
  return (
    <Card className="">
      <CardHeader className="flex flex-row gap-4">
        <div className="flex flex-col items-center">
          <UpvoteIcon className="h-5 w-5 cursor-pointer" />
          <DownvoteIcon className="h-5 w-5 cursor-pointer" />
        </div>
        <div>
          <CardTitle className=""></CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p></p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          color="primary"
          // variant="flat"
          className="w-full rounded-[20px]"
        >
          Show code
        </Button>
      </CardFooter>
      <Skeleton isLoaded={false} className="rounded-lg">
        <div className="h-24 rounded-lg bg-secondary"></div>
      </Skeleton>
      <div className="space-y-3">
        <Skeleton isLoaded={false} className="w-3/5 rounded-lg">
          <div className="h-3 w-full rounded-lg bg-secondary"></div>
        </Skeleton>
        <Skeleton isLoaded={false} className="w-4/5 rounded-lg">
          <div className="h-3 w-full rounded-lg bg-secondary-300"></div>
        </Skeleton>
        <Skeleton isLoaded={false} className="w-2/5 rounded-lg">
          <div className="h-3 w-full rounded-lg bg-secondary-200"></div>
        </Skeleton>
      </div>
    </Card>
  );
}
