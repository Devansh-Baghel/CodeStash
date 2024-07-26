import { asyncHandler } from "../utils/asyncHandler";

export const healthCheck = asyncHandler((req, res) => {
  res.send("Api is Healthy!");
});
