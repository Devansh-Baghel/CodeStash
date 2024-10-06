import { z } from "zod";

export const communityNameSchema = z
  .string()
  .min(3, { message: "Subreddit name must be at least 3 characters long" })
  .max(21, { message: "Subreddit name must be at most 21 characters long" })
  .regex(/^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/, {
    message:
      "Subreddit name can only contain letters, numbers, underscores, and hyphens, but must not start or end with a hyphen or underscore",
  });
