import { BiUpvote as UpvoteIcon } from "react-icons/bi";
import { BiDownvote as DownvoteIcon } from "react-icons/bi";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Comment } from "@/types/commentTypes";
import React from "react";

function CommentItem({
  comment,
  madeBy,
}: {
  comment: Comment;
  madeBy: string;
}) {
  return (
    <li key={comment._id} className="flex gap-2 rounded-xl bg-primary-50 p-2">
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
  );
}

export default CommentItem;
