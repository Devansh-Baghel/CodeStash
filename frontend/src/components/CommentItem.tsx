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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import { useUserStore } from "@/store/userStore";
import { Comment } from "@/types/commentTypes";
import fetcher from "@/utils/axios";
import { Textarea } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "./ui/badge";
import { Button as ShadButton } from "./ui/button";
// import { toast } from "./ui/use-toast";
import toast from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import MutationButton from "./MutationButton";
import { infoToast } from "@/utils/constants";

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
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const [parent] = useAutoAnimate();

  const { mutate, isPending } = useMutation({
    mutationKey: [`comment - ${comment._id}`],
    mutationFn: async () => {
      const updateCommentPromise = fetcher
        .patch("/comments/update-comment", {
          commentId: comment._id,
          content: updatedContent,
        })
        .then(() => {
          setIsUpdating(false);
          refetch();
        });

      toast.promise(updateCommentPromise, {
        loading: "Updating comment...",
        success: "Comment updated successfully",
        error: "Failed to update comment",
      });

      return updateCommentPromise;
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
      infoToast("Comment can't be empty");
      return;
    }

    if (updatedContent === comment.content) {
      infoToast("You haven't made any changes");
      return;
    }

    mutate();
  }

  function deleteComment() {
    const deleteCommentPromise = fetcher
      .post("/comments/delete-comment", { commentId: comment._id })
      .then(() => {
        refetch();
      });

    toast.promise(deleteCommentPromise, {
      loading: "Deleting comment...",
      success: "Comment deleted successfully",
      error: "Failed to delete comment",
    });

    onClose();
  }

  return (
    <li className="flex gap-2 rounded-xl bg-primary-50 p-2">
      <div className="flex flex-col items-center" ref={parent}>
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

              <button onClick={onOpen}>
                <DeleteIcon className="size-5 hover:cursor-pointer hover:text-red-500" />
              </button>
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop="blur"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Are you sure about deleting this comment?
                      </ModalHeader>
                      <ModalBody>
                        <p>This will permanently delete your comment.</p>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Close
                        </Button>
                        <Button color="primary" onClick={deleteComment}>
                          Delete Comment
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
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
              <MutationButton
                isPending={isPending}
                size="sm"
                radius="lg"
                type="submit"
              >
                {isPending ? "Saving" : "Save"} changes
              </MutationButton>
              {!isPending && (
                <ShadButton
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setIsUpdating(false);
                    setUpdatedContent(comment.content);
                  }}
                >
                  Cancel
                </ShadButton>
              )}
            </div>
          </form>
        ) : (
          <p className="whitespace-pre-wrap">{updatedContent}</p>
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
