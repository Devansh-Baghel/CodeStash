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
import { cn } from "@/lib/utils";
import { cardLayout } from "@/utils/classnames";
import BackButton from "@/components/BackButton";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { LuPencilLine as EditIcon } from "react-icons/lu";
import { Button as ShadButton } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  async function deletePost() {
    await fetcher.post("/posts/delete-post", { postId: post._id }).then(() => {
      router.push("/");
    });
  }

  if (isError) return "Error";
  if (isLoading) return <PostSkeleton />;

  return (
    <section className={cn(cardLayout)}>
      <div className="flex items-center justify-between">
        <BackButton />
        {post.madeBy.username === userData?.username && (
          <div>
            <ShadButton
              className="text-sm text-black hover:text-primary"
              variant="link"
              size="sm"
            >
              <EditIcon className="mr-1 h-4 w-4" />
              Update Post
            </ShadButton>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <ShadButton
                  className="text-sm text-black hover:text-red-500"
                  variant="link"
                  size="sm"
                >
                  <DeleteIcon className="mr-1 h-4 w-4" />
                  Delete Post
                </ShadButton>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure that you want to delete this post?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your post and all its comments.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deletePost}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      <Card>
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
            <Link href={`/c/${post.community}`} className="underline">
              c/{post.community}
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
      <Comments postId={params.postId} madeBy={post.madeBy.username} />
    </section>
  );
}
