import mongoose, { Schema, Document } from "mongoose";

export interface SnippetTypes extends Document {
  content: string;
  // TODO: Make language an array of only selected langs ["JavaScript", "Python" ...]
  language: string;
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
      // FIXME: Add more langs here
      enum: ["javascript", "python"],
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Snippet = mongoose.model<SnippetTypes>("Snippet", snippetSchema);
