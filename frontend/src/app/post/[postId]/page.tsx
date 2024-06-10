import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code } from "bright";
import { BiUpvote as UpvoteIcon } from "react-icons/bi";
import { BiDownvote as DownvoteIcon } from "react-icons/bi";
import CopyCodeButton from "@/components/CopyCodeButton";
import Link from "next/link";
import fetcher from "@/utils/axios";

// Default Code Display settings
Code.theme = "dracula";

export default async function Post({ params }: { params: { postId: string } }) {
  const post = await fetcher.post("/posts/get-post", {
    postId: params.postId,
  });

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
          <CardDescription>{post.madeBy.fullname}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p>{post.description}</p>
        <br />
        <Code lang="python">{post.content}</Code>
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
