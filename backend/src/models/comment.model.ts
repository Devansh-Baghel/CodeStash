import mongoose, { Schema, Document } from "mongoose";

export interface CommentTypes extends Document {
  madeBy: Schema.Types.ObjectId;
  parent: Schema.Types.ObjectId;
  type: "comment" | "reply";
  content: string;
  upvotes: number;
  downvotes: number;
}

const commentSchema: Schema<CommentTypes> = new Schema(
  {
    madeBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment" || "Post",
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "comment",
    },
    content: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
