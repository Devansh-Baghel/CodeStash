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
import { Button } from "@nextui-org/react";
import { useUserStore } from "@/store/userStore";
import Comments from "@/components/Comments";

export default function Post({ params }: { params: { postId: string } }) {
  const { isLoggedIn, userData, savePost, removeSavedPost } = useUserStore();
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

  // async function savePost() {
  //   await fetcher.post("/posts/save", { postId: post._id });
  // }

  // async function removeSavedPost(postId: string) {
  //   await fetcher.patch("/posts/remove-saved-post", { postId });
  // }

  return (
    <section>
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
          <div className="mt-6 flex flex-col gap-4">
            <CopyCodeButton code={post.content} />
            {isLoggedIn && (
              <>
                {userData?.savedPosts.includes(post._id) ? (
                  <Button
                    variant="flat"
                    color="primary"
                    className="w-full rounded-[20px] text-lg"
                    onClick={() => removeSavedPost(post._id)}
                  >
                    Remove from saved
                  </Button>
                ) : (
                  <Button
                    variant="flat"
                    color="primary"
                    radius="full"
                    className="w-full text-lg"
                    onClick={() => savePost(post._id)}
                  >
                    Save post
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p>
            Posted in{" "}
            <Link href={`/c/${post.language}`} className="underline">
              c/{post.language}
            </Link>{" "}
            community
          </p>

          {/* FIXME: make this a badge, label or chip that a user can click */}
          <p>
            Written in{" "}
            <Link href={`/?language=${post.language}`} className="underline">
              {post.language}
            </Link>{" "}
          </p>
        </CardFooter>
      </Card>
      <Comments postId={params.postId} />
    </section>
  );
}
