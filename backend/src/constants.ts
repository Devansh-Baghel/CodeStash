import { CookieOptions } from 'express';

export const DB_NAME = "CodeStash";
export const PORT = process.env.PORT || 8000;
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};
