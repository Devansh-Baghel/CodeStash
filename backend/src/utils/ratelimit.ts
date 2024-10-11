import { Ratelimit } from "@unkey/ratelimit";

if (!process.env.UNKEY_ROOT_KEY) {
  throw new Error("UNKEY_ROOT_KEY is not set");
}

export const limiter = new Ratelimit({
  namespace: "codestash",
  limit: 10,
  duration: "60s",
  rootKey: process.env.UNKEY_ROOT_KEY,
});
