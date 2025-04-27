import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/store/userStore";
import { PostTypes } from "@/types/postTypes";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiLoaderAlt as Loader } from "react-icons/bi";

export default function PostItem({ post }: { post: PostTypes }) {
  const router = useRouter();
  const [parent] = useAutoAnimate();
  const { isLoggedIn, upvotePost, userData, downvotePost } = useUserStore();
  const [upvoteCount, setUpvoteCount] = useState(post.upvotes - post.downvotes);
  const [postLoading, setPostLoading] = useState(false);

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
    <Card className="border-none drop-shadow-lg">
      <CardHeader className="flex flex-row gap-4">
        {/* <div className="flex flex-col items-center" ref={parent}>
          {userData?.upvotedPosts.includes(post._id) ? (
            <SolidUpvoteIcon
              className="size-5 cursor-pointer"
              onClick={() => handleInteraction(post._id, "upvote")}
            />
          ) : (
            <UpvoteIcon
              className="size-5 cursor-pointer"
              onClick={() => handleInteraction(post._id, "upvote")}
            />
          )}
          {upvoteCount}
          {userData?.downvotedPosts.includes(post._id) ? (
            <SolidDownvoteIcon
              className="size-5 cursor-pointer"
              onClick={() => handleInteraction(post._id, "downvote")}
            />
          ) : (
            <DownvoteIcon
              className="size-5 cursor-pointer"
              onClick={() => handleInteraction(post._id, "downvote")}
            />
          )}
        </div> */}
        <div>
          <CardTitle className="">
            <Link href={`/post/${post._id}`}>{post.title}</Link>
          </CardTitle>
          <CardDescription>
            <Link
              href={
                post.madeBy.username === userData?.username
                  ? "/profile"
                  : `/u/${post.madeBy.username}`
              }
            >
              u/{post.madeBy.username}
            </Link>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">
          {post.description.length > 400
            ? post.description.slice(0, 400) + "..."
            : post.description}
        </p>
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
          variant={postLoading ? "flat" : "solid"}
          className="w-full rounded-[20px]"
          as={Link}
          href={`/post/${post._id}`}
          onClick={() => setPostLoading(true)}
        >
          {postLoading ? (
            <span className="flex items-center justify-center">
              <Loader className="mr-2 size-4 animate-spin" />
              Loading post...
            </span>
          ) : (
            "Show code"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
