import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import {
  BiDownvote as DownvoteIcon,
  BiLoaderAlt as Loader,
  BiSolidDownvote as SolidDownvoteIcon,
  BiSolidUpvote as SolidUpvoteIcon,
  BiUpvote as UpvoteIcon,
} from "react-icons/bi";
import { LuPencilLine as EditIcon } from "react-icons/lu";
import { MdDelete as DeleteIcon } from "react-icons/md";

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
import { useUserStore } from "@/store/userStore";
import { Comment } from "@/types/commentTypes";
import fetcher from "@/utils/axios";
import { Textarea } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

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

  function deleteComment() {
    fetcher
      .post("/comments/delete-comment", { commentId: comment._id })
      .then(() => {
        toast({
          description: "Comment deleted successfully",
        });

        refetch();
      });
  }

  return (
    <li className="flex gap-2 rounded-xl bg-primary-50 p-2">
      <div className="flex flex-col items-center">
        {userData?.upvotedComments.includes(comment._id) ? (
          <SolidUpvoteIcon
            className="size-5 cursor-pointer"
            onClick={() => handleInteraction("upvote")}
          />
        ) : (
          <UpvoteIcon
            className="size-5 cursor-pointer"
            onClick={() => handleInteraction("upvote")}
          />
        )}
        {upvoteCount}
        {userData?.downvotedComments.includes(comment._id) ? (
          <SolidDownvoteIcon
            className="size-5 cursor-pointer"
            onClick={() => handleInteraction("downvote")}
          />
        ) : (
          <DownvoteIcon
            className="size-5 cursor-pointer"
            onClick={() => handleInteraction("downvote")}
          />
        )}
      </div>
      <div className="flex w-full flex-col">
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

          {comment.madeBy.userId === userData?._id && !isUpdating && (
            <div className="flex items-center gap-2 text-xs">
              <button onClick={() => setIsUpdating(true)}>
                <Badge
                  className="font-normal hover:cursor-pointer"
                  variant="default"
                >
                  Update
                </Badge>
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button>
                    <DeleteIcon className="size-5 hover:cursor-pointer hover:text-red-500" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure about deleting this comment?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your comment.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteComment}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                {isPending && <Loader className="mr-2 size-4 animate-spin" />}
                Save changes
              </Button>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => {
                  setIsUpdating(false);
                  setUpdatedContent(comment.content);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <p>{updatedContent}</p>
        )}
        {comment.isEdited && (
          <span className="mr-1 flex items-center gap-1 self-end text-xs text-slate-500">
            edited
            <EditIcon />
          </span>
        )}
      </div>
    </li>
  );
}

export default CommentItem;
