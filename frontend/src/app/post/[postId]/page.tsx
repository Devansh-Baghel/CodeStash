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
import { BiSolidUpvote as SolidUpvoteIcon } from "react-icons/bi";
import { BiDownvote as DownvoteIcon } from "react-icons/bi";
import { BiSolidDownvote as SolidDownvoteIcon } from "react-icons/bi";
import CopyCodeButton from "@/components/CopyCodeButton";
import Link from "next/link";
import fetcher from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@nextui-org/react";
import { useUserStore } from "@/store/userStore";
import Comments from "@/components/Comments";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PostSkeleton from "@/components/skeletons/PostSkeleton";

export default function Post({ params }: { params: { postId: string } }) {
  const {
    isLoggedIn,
    userData,
    savePost,
    removeSavedPost,
    upvotePost,
    downvotePost,
  } = useUserStore();
  const router = useRouter();
  const [upvoteCount, setUpvoteCount] = useState(0);
  // FIXME: add post types
  const {
    data: post,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [params.postId],
    queryFn: async () => {
      return await fetcher
        .post("/posts/get-post", { postId: params.postId })
        .then((res) => {
          setUpvoteCount(res.upvotes - res.downvotes);
          return res;
        });
    },
  });

  // TODO: Create a custom hook to do this
  function handleInteraction(postId: string, action: "upvote" | "downvote") {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (action === "upvote") {
      upvotePost(postId);
      if (userData?.upvotedPosts.includes(postId)) {
        setUpvoteCount((count) => count - 1);
      } else {
        if (userData?.downvotedPosts.includes(postId)) {
          setUpvoteCount((count) => count + 2);
        } else {
          setUpvoteCount((count) => count + 1);
        }
      }
    } else if (action === "downvote") {
      downvotePost(postId);
      if (userData?.downvotedPosts.includes(postId)) {
        setUpvoteCount((count) => count + 1);
      } else {
        if (userData?.upvotedPosts.includes(postId)) {
          setUpvoteCount((count) => count - 2);
        } else {
          setUpvoteCount((count) => count - 1);
        }
      }
    }
  }

  if (isError) return "Error";
  if (isLoading) return <PostSkeleton />;

  return (
    <section>
      <Card className="w-[90vw] max-w-[700px] md:w-[60vw]">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex flex-col items-center">
            {userData?.upvotedPosts.includes(post._id) ? (
              <SolidUpvoteIcon
                className="h-5 w-5 cursor-pointer"
                onClick={() => handleInteraction(post._id, "upvote")}
              />
            ) : (
              <UpvoteIcon
                className="h-5 w-5 cursor-pointer"
                onClick={() => handleInteraction(post._id, "upvote")}
              />
            )}
            {upvoteCount}
            {userData?.downvotedPosts.includes(post._id) ? (
              <SolidDownvoteIcon
                className="h-5 w-5 cursor-pointer"
                onClick={() => handleInteraction(post._id, "downvote")}
              />
            ) : (
              <DownvoteIcon
                className="h-5 w-5 cursor-pointer"
                onClick={() => handleInteraction(post._id, "downvote")}
              />
            )}
          </div>
          <div>
            <CardTitle className="text-lg">{post.title}</CardTitle>
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
      {/* TODO: add a card that displays some stats about the community that this post is posted in */}
      <Comments postId={params.postId} />
    </section>
  );
}
