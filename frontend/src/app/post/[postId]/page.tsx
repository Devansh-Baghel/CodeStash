"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock, dracula } from "react-code-blocks";
import { BiUpvote as UpvoteIcon } from "react-icons/bi";
import { BiDownvote as DownvoteIcon } from "react-icons/bi";
import CopyCodeButton from "@/components/CopyCodeButton";
import Link from "next/link";
import fetcher from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export default function Post({ params }: { params: { postId: string } }) {
  // FIXME: add post types
  const {
    data: post,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [params.postId],
    queryFn: async () => {
      return await fetcher.post("/posts/get-post", { postId: params.postId });
    },
  });

  if (isError) return "Error";
  if (isLoading) return "Loading...";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex gap-1">
          {/* FIXME: Change to solid verison of these icons when clicked */}
          <UpvoteIcon className="h-6 w-6" />
          {post.upvotes - post.downvotes}
          <DownvoteIcon className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="">{post.title}</CardTitle>
          <CardDescription>
            <Link href={`/u/${post.madeBy.username}`}>
              u/{post.madeBy.username}
            </Link>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p>{post.description}</p>
        <br />
        <CodeBlock
          text={post.content}
          language={post.language}
          theme={dracula}
          showLineNumbers={false}
        />
        <CopyCodeButton code={post.content} />
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p>
          Posted in{" "}
          <Link href={`/c/${post.language}`} className="underline">
            c/{post.language}
          </Link>{" "}
          community
        </p>
      </CardFooter>
    </Card>
    // TODO: Add comments and replies for these posts
  );
}
