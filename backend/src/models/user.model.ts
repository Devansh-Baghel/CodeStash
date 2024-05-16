import mongoose, { Schema, Document, mongo } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  refershToken: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
}

const userSchema: Schema<User> = new Schema({
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
  refershToken: {
    type: String,
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
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

export const User = mongoose.model<User>("User", userSchema);
