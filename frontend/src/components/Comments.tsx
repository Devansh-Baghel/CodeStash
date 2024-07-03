"use client";

import fetcher from "@/utils/axios";
import { Button, Textarea } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiUpvote as UpvoteIcon } from "react-icons/bi";
import { BiDownvote as DownvoteIcon } from "react-icons/bi";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { Comment } from "@/types/commentTypes";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import CommentsSkeleton from "./skeletons/CommentsSkeleton";
import { Badge } from "./ui/badge";

type CommentProps = {
  postId: string;
  madeBy: string;
};

export default function Comments({ postId, madeBy }: CommentProps) {
  const [comment, setComment] = useState("");
  const { isLoggedIn, userData } = useUserStore();
  const router = useRouter();
  const { data, isError, isLoading, refetch, isRefetchError, isRefetching } =
    useQuery<Comment[]>({
      queryKey: [`${postId}/comments`],
      queryFn: async () => {
        return await fetcher.post("/comments/get-comments", { postId });
      },
    });
  const { mutateAsync, isPending } = useMutation({
    mutationKey: [`${postId}/comments`],
    mutationFn: async () => {
      return await fetcher.put("/comments/create-comment", {
        postId,
        content: comment,
      });
    },
  });

  async function addComment(e: FormEvent) {
    e.preventDefault();
    if (!comment) return;

    await mutateAsync();
    await refetch();
    setComment("");
  }

  if (isError || isRefetchError) return "Error";
  if (isLoading) return <CommentsSkeleton />;

  // TODO: show "OP" label if the comment is made by same id as the post
  return (
    <Card className="my-6">
      <CardHeader className="">
        <CardTitle>
          {data?.length === 1
            ? `${data.length} Comment`
            : `${data?.length} Comments`}
        </CardTitle>
        {isLoggedIn ? (
          <form onSubmit={addComment}>
            <Textarea
              variant="underlined"
              required
              color="primary"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
              className={`col-span-12 mb-3 md:col-span-6 ${!comment && "h-10"}`}
            />
            {comment && (
              <Button
                color="primary"
                type="submit"
                isLoading={isRefetching || isPending}
              >
                Add comment
              </Button>
            )}
          </form>
        ) : (
          <div className="flex flex-col gap-2">
            <p>Login to post comments</p>
            <Button
              variant="flat"
              radius="full"
              color="primary"
              className="w-full max-w-80"
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {data?.length === 0 ? (
          // TODO: add better ui for no comments yet.
          <p>No comments yet</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {/* TODO: show "adding comment..." when user adds a new comment */}
            {data?.map((comment) => (
              <li
                key={comment._id}
                className="flex gap-2 rounded-xl bg-primary-50 p-2"
              >
                <div className="flex flex-col items-center">
                  {/* FIXME: Change to solid verison of these icons when clicked */}
                  <UpvoteIcon className="h-5 w-5 cursor-pointer" />
                  {comment.upvotes - comment.downvotes}
                  <DownvoteIcon className="h-5 w-5 cursor-pointer" />
                </div>
                <div>
                  <Link
                    href={`/u/${comment.madeBy.username}`}
                    className="text-grey-700 text-xs"
                  >
                    u/{comment.madeBy.username}
                    {comment.madeBy.username === madeBy && (
                      <Badge className="ml-2">OP</Badge>
                    )}
                  </Link>
                  <p>{comment.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
