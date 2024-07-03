import { BiUpvote as UpvoteIcon } from "react-icons/bi";
import { BiSolidUpvote as SolidUpvoteIcon } from "react-icons/bi";
import { BiDownvote as DownvoteIcon } from "react-icons/bi";
import { BiSolidDownvote as SolidDownvoteIcon } from "react-icons/bi";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Comment } from "@/types/commentTypes";
import React, { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

function CommentItem({
  comment,
  madeBy,
}: {
  comment: Comment;
  madeBy: string;
}) {
  const { upvoteComment, downvoteComment, isLoggedIn, userData } =
    useUserStore();
  const [upvoteCount, setUpvoteCount] = useState(
    comment.upvotes - comment.downvotes,
  );
  const router = useRouter();

  function handleInteraction(commentId: string, action: "upvote" | "downvote") {
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
  }

  //   FIXME: comment count is cached after an upvote/downvote and user has to refresh to get the accurate count
  return (
    <li key={comment._id} className="flex gap-2 rounded-xl bg-primary-50 p-2">
      <div className="flex flex-col items-center">
        {/* FIXME: Change to solid verison of these icons when clicked */}
        {userData?.upvotedComments.includes(comment._id) ? (
          <SolidUpvoteIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => handleInteraction(comment._id, "upvote")}
          />
        ) : (
          <UpvoteIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => handleInteraction(comment._id, "upvote")}
          />
        )}
        {upvoteCount}
        {userData?.downvotedComments.includes(comment._id) ? (
          <SolidDownvoteIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => handleInteraction(comment._id, "downvote")}
          />
        ) : (
          <DownvoteIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => handleInteraction(comment._id, "downvote")}
          />
        )}
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
  );
}

export default CommentItem;
