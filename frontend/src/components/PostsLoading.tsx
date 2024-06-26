import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/react";

export default function PostsLoading() {
  return (
    <>
      {[1, 2, 3, 4].map((_, index) => (
        <Card className="mb-4" key={index}>
          <CardHeader className="flex flex-row gap-4">
            <div>
              <CardTitle className="">
                <Skeleton className="h-10 w-[80vw] rounded-2xl md:w-[50vw] md:max-w-[600px]" />
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-[80vw] rounded-2xl md:w-[50vw] md:max-w-[600px]" />
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
