"use client";
import fetcher from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";

type PostTypes = {
  _id: string;
  title: string;
  content: string;
  description: string;
  madeBy: string;
  upvotes: number;
  downvotes: number;
};

export default function Posts() {
  const { data, isError, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await fetcher.get("/posts/get-posts"),
  });

  // TODO: Add better loading and error states
  if (isPending) return "Loading...";
  if (isError) return "Erorr";

  return (
    <div className="flex flex-col gap-4">
      {data.map((post: PostTypes) => (
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">NextUI</p>
              <p className="text-small text-default-500">nextui.org</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>Make beautiful websites regardless of your design experience.</p>
          </CardBody>
          <Divider />
          <CardFooter>
            <Link
              isExternal
              showAnchorIcon
              href="https://github.com/nextui-org/nextui"
            >
              Visit source code on GitHub.
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
