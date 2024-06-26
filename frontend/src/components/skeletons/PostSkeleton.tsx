import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button, Skeleton } from "@nextui-org/react";

export default function PostSkeleton() {
  return (
    <Card className="w-[90vw] max-w-[700px] md:w-[60vw]">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-10 rounded-2xl" />
          <Skeleton className="mt-3 h-4 w-52 rounded-sm" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-52 rounded-2xl" />
      </CardContent>
      <CardFooter>
        <Button
          variant="flat"
          color="primary"
          radius="full"
          isLoading
          className="w-full text-lg"
        >
          Save post
        </Button>
      </CardFooter>
    </Card>
  );
}
