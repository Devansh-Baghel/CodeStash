import mongoose, { Document, Schema } from "mongoose";

export interface CommentTypes extends Document {
  madeBy: {
    userId: Schema.Types.ObjectId;
    username: string;
  };
  parent: Schema.Types.ObjectId;
  type: "comment" | "reply";
  content: string;
  upvotes: number;
  downvotes: number;
  isEdited: boolean;
}

const commentSchema: Schema<CommentTypes> = new Schema(
  {
    madeBy: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        // unique: true,
      },
      username: {
        type: String,
        trim: true,
        required: true,
        // unique: true,
      },
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
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Comment = mongoose.model("Comment", commentSchema);
