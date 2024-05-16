import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { UserTypes } from "../models/user.model";

interface JwtPayload {
  _id: string;
}

interface VerifyUserRequest extends Request {
  user?: UserTypes;
}

export const verifyJWT = asyncHandler(
  async (req: VerifyUserRequest, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) throw new ApiError(401, "Unauthorized request");

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;

      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) throw new ApiError(401, "Invalid Access Token");

      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(
        401,
        (error as Error).message || "Invalid access token"
      );
    }
  }
);
