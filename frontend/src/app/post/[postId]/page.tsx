"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CodeBlock, dracula } from "react-code-blocks";
import {
  BiDownvote as DownvoteIcon,
  BiSolidDownvote as SolidDownvoteIcon,
  BiSolidUpvote as SolidUpvoteIcon,
  BiUpvote as UpvoteIcon,
} from "react-icons/bi";
import { LuPencilLine as EditIcon } from "react-icons/lu";
import { BsStars as StarsIcon } from "react-icons/bs";
import { MdBookmarkAdd as BookmarkAddIcon } from "react-icons/md";
import { MdBookmarkRemove as BookmarkRemoveIcon } from "react-icons/md";
import BackButton from "@/components/buttons/BackButton";
import Comments from "@/components/Comments";
import CopyCodeButton from "@/components/buttons/CopyCodeButton";
import PostSkeleton from "@/components/skeletons/PostSkeleton";

import { Button as ShadButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import DeletePostButton from "@/components/buttons/DeletePostButton";
import VSCodeButton from "@/components/buttons/VSCodeButton";
import { PostTypes } from "@/types/postTypes";
import toast from "react-hot-toast";

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
  const {
    data: post,
    isError,
    isLoading,
  } = useQuery<PostTypes>({
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

  if (isLoading) return <PostSkeleton />;
  if (isError || !post) return "Error";

  return (
    <section className={cn(cardLayout)}>
      <div className="flex items-center justify-between">
        <BackButton />
        {post.madeBy.userId === userData?._id && (
          <div>
            <ShadButton
              className="text-sm text-black hover:text-primary"
              variant="link"
              size="sm"
              onClick={() => router.push(`/update-post?postId=${post._id}`)}
            >
              <EditIcon className="mr-1 size-4" />
              Update Post
            </ShadButton>
            <DeletePostButton postId={post._id} />
          </div>
        )}
        <Button
          className="mb-2"
          color="primary"
          variant="flat"
          onClick={() => toast("This feature isn't implemented yet")}
        >
          <StarsIcon className="size-5" />
          Explain this
        </Button>
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
                className="size-5 cursor-pointer"
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
        <CardContent className="flex flex-col gap-4">
          <p>{post.description}</p>
          <VSCodeButton
            snippet={post.content}
            fileName={post.title}
            fileType={post.language}
          />
          <CodeBlock
            text={post.content}
            language={post.language}
            theme={dracula}
            showLineNumbers={false}
          />
          <div className="flex gap-2">
            {isLoggedIn && (
              <>
                {userData?.savedPosts.includes(post._id) ? (
                  <Button
                    variant="flat"
                    color="danger"
                    radius="full"
                    className="w-full"
                    // className="w-full rounded-[20px] text-lg"
                    onClick={() => removeSavedPost(post._id)}
                  >
                    <BookmarkRemoveIcon className="size-5" />
                    Remove from saved
                  </Button>
                ) : (
                  <Button
                    variant="flat"
                    color="success"
                    radius="full"
                    className="w-full"
                    // className="w-full text-lg"
                    onClick={() => savePost(post._id)}
                  >
                    <BookmarkAddIcon className="size-5" />
                    Save post
                  </Button>
                )}
              </>
            )}
            <CopyCodeButton code={post.content} />
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
