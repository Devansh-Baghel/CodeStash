import { PostTypes } from "@/types/postTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BiUpvote as UpvoteIcon } from "react-icons/bi";
import { BiSolidUpvote as SolidUpvoteIcon } from "react-icons/bi";
import { BiDownvote as DownvoteIcon } from "react-icons/bi";
import { BiSolidDownvote as SolidDownvoteIcon } from "react-icons/bi";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";

export default function PostItem({ post }: { post: PostTypes }) {
  const router = useRouter();
  const { isLoggedIn, upvotePost, userData, downvotePost } = useUserStore();
  const [upvoteCount, setUpvoteCount] = useState(post.upvotes - post.downvotes);

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

  return (
    <Card key={post._id} className="bg-sky-50">
      <CardHeader className="flex flex-row gap-4">
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
          <CardTitle className="">
            <Link href={`/post/${post._id}`}>{post.title}</Link>
          </CardTitle>
          <CardDescription>
            <Link href={`/u/${post.madeBy.username}`}>
              u/{post.madeBy.username}
            </Link>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p>{post.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p>
          Posted in{" "}
          <Link href={`/c/${post.community}`} className="underline">
            c/{post.community}
          </Link>{" "}
          community
        </p>
        <Button
          color="primary"
          // variant="flat"
          className="w-full rounded-[20px]"
          onClick={() => router.push(`/post/${post._id}`)}
        >
          Show code
        </Button>
      </CardFooter>
    </Card>
  );
}
