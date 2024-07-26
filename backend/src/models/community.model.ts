import mongoose, { Document, Schema } from "mongoose";

export interface CommunityTypes extends Document {
  madeBy: {
    userId: Schema.Types.ObjectId;
    username: string;
  };
  name: string;
  description: string;
  joinedMembers: number;
  coverImage: string;
  avatar: string;
}

const communitySchema: Schema<CommunityTypes> = new Schema(
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
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    joinedMembers: {
      type: Number,
      default: 1,
    },
    coverImage: { type: String },
    avatar: { type: String },
  },
  { timestamps: true },
);

export const Community = mongoose.model("Community", communitySchema);
