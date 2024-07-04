import { BiUpvote as UpvoteIcon } from "react-icons/bi";
import { BiSolidUpvote as SolidUpvoteIcon } from "react-icons/bi";
import { BiDownvote as DownvoteIcon } from "react-icons/bi";
import { BiSolidDownvote as SolidDownvoteIcon } from "react-icons/bi";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Comment } from "@/types/commentTypes";
import React, { FormEvent, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { Textarea } from "@nextui-org/react";
// import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import fetcher from "@/utils/axios";
import { toast } from "./ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { BiLoaderAlt as Loader } from "react-icons/bi";

type CommentItemPropTypes = {
  comment: Comment;
  madeBy: string;
  refetch: () => void;
};

function CommentItem({ comment, madeBy, refetch }: CommentItemPropTypes) {
  const { upvoteComment, downvoteComment, isLoggedIn, userData } =
    useUserStore();
  const [upvoteCount, setUpvoteCount] = useState(
    comment.upvotes - comment.downvotes,
  );
  const [updatedContent, setUpdatedContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: [`comment - ${comment._id}`],
    mutationFn: async () => {
      await fetcher
        .patch("/comments/update-comment", {
          commentId: comment._id,
          content: updatedContent,
        })
        .then(() => {
          toast({
            description: "Updated comment successfully!",
          });
          setIsUpdating(false);
          refetch();
        });
    },
  });

  function handleInteraction(action: "upvote" | "downvote") {
    const commentId = comment._id;

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (action === "upvote") {
      upvoteComment(commentId);
      if (userData?.upvotedComments.includes(commentId)) {
        setUpvoteCount((count) => count - 1);
      } else {
        if (userData?.downvotedComments.includes(commentId)) {
          setUpvoteCount((count) => count + 2);
        } else {
          setUpvoteCount((count) => count + 1);
        }
      }
    } else if (action === "downvote") {
      downvoteComment(commentId);
      if (userData?.downvotedComments.includes(commentId)) {
        setUpvoteCount((count) => count + 1);
      } else {
        if (userData?.upvotedComments.includes(commentId)) {
          setUpvoteCount((count) => count - 2);
        } else {
          setUpvoteCount((count) => count - 1);
        }
      }
    }

    refetch();
  }

  function updateComment(e: FormEvent) {
    e.preventDefault();

    if (!updatedContent) {
      toast({
        description: "Comment can't be empty",
      });
      return;
    }

    if (updatedContent === comment.content) {
      toast({
        description: "You haven't made any changes",
      });
      return;
    }

    mutate();
  }

  //   FIXME: comment count is cached after an upvote/downvote and user has to refresh to get the accurate count
  return (
    <li key={comment._id} className="flex gap-2 rounded-xl bg-primary-50 p-2">
      <div className="flex flex-col items-center">
        {/* FIXME: Change to solid verison of these icons when clicked */}
        {userData?.upvotedComments.includes(comment._id) ? (
          <SolidUpvoteIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => handleInteraction("upvote")}
          />
        ) : (
          <UpvoteIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => handleInteraction("upvote")}
          />
        )}
        {upvoteCount}
        {userData?.downvotedComments.includes(comment._id) ? (
          <SolidDownvoteIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => handleInteraction("downvote")}
          />
        ) : (
          <DownvoteIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => handleInteraction("downvote")}
          />
        )}
      </div>
      <div className="w-full">
        <div className="flex w-full justify-between">
          <Link
            href={`/u/${comment.madeBy.username}`}
            className="text-grey-700 text-xs"
          >
            u/{comment.madeBy.username}
            {comment.madeBy.username === madeBy && (
              <Badge className="ml-2 text-xs font-normal">OP</Badge>
            )}
          </Link>

          {comment.madeBy.username === userData?.username && !isUpdating && (
            <div className="flex items-center gap-2 text-xs">
              <Badge
                className="hover:cursor-pointer"
                variant="default"
                onClick={() => setIsUpdating(true)}
              >
                Update
              </Badge>
              <DeleteIcon className="h-5 w-5 hover:cursor-pointer hover:text-red-500" />
            </div>
          )}
        </div>
        {isUpdating ? (
          <form onSubmit={updateComment}>
            <Textarea
              variant="bordered"
              color="primary"
              className="my-2"
              required
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
            />
            <div className="flex gap-2">
              <Button size="sm" disabled={isPending}>
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => setIsUpdating(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <p>{updatedContent}</p>
        )}
      </div>
    </li>
  );
}

export default CommentItem;
