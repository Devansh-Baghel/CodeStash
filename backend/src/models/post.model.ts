import mongoose, { Document, Schema } from "mongoose";

import { CommentTypes } from "./comment.model";

export const allowedLanguages = [
  "javascript",
  "python",
  "typescript",
  "ruby",
  "java",
  "csharp",
  "cpp",
  "go",
  "php",
  "swift",
] as const;

type Language = (typeof allowedLanguages)[number];

export interface PostTypes extends Document {
  content: string;
  language: Language;
  community: string;
  title: string;
  upvotes: number;
  downvotes: number;
  description: string;
  madeBy: {
    userId: Schema.Types.ObjectId;
    fullname: string;
    username: string;
  };
  comments?: CommentTypes[];
}

const postSchema: Schema<PostTypes> = new Schema(
  {
    madeBy: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      fullname: {
        type: String,
        trim: true,
        required: true,
      },
      username: {
        type: String,
        trim: true,
        required: true,
      },
    },
    content: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: allowedLanguages,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    community: { type: String, required: true, default: "all" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// to search by title, content and description
postSchema.index(
  { title: "text", content: "text", description: "text" },
  { language_override: "none" }
);

const Post = mongoose.model<PostTypes>("Post", postSchema);
Post.createIndexes();

export { Post };
