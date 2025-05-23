import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Document, Schema } from "mongoose";

export interface UserTypes extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  refreshToken: string;
  upvotedPosts: Schema.Types.ObjectId[];
  downvotedPosts: Schema.Types.ObjectId[];
  savedPosts: Schema.Types.ObjectId[];
  upvotedComments: Schema.Types.ObjectId[];
  downvotedComments: Schema.Types.ObjectId[];
  communitiesJoined: string[];
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isVerified: boolean;
  avatar: string;
  downloadPath: string;
  generateRefreshToken: () => string;
  generateAccessToken: () => string;
  isPasswordCorrect: (password: string) => Promise<boolean>;
}

const userSchema: Schema<UserTypes> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
        "Please use a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is requird"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      index: true,
    },
    refreshToken: {
      type: String,
    },
    upvotedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    downvotedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    upvotedComments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    downvotedComments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    // TODO: Add this feature
    // verifyCode: {
    //   type: String,
    //   required: [true, "Verify code is required"],
    // },
    // verifyCodeExpiry: {
    //   type: Date,
    //   required: [true, "Verify code expiry is required"],
    // },
    isVerified: {
      type: Boolean,
      default: false,
    },
    communitiesJoined: [
      {
        type: String,
        default: "all",
      },
    ],
    avatar: {
      type: String,
    },
    downloadPath: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model<UserTypes>("User", userSchema);
