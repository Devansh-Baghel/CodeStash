import mongoose, { Schema, Document } from "mongoose";

const allowedLanguages = [
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

export interface SnippetTypes extends Document {
  content: string;
  language: Language;
  title: string;
  upvotes: number;
  downvotes: number;
  description: string;
  madeBy: Schema.Types.ObjectId;
  // TODO: Add comments in snippets
  // comments: Comment[];
}

const snippetSchema: Schema<SnippetTypes> = new Schema(
  {
    madeBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    title: { type: String, required: true },
    description: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Snippet = mongoose.model<SnippetTypes>("Snippet", snippetSchema);
