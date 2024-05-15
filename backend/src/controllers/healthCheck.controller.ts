import { asyncHandler } from "../utils/asyncHandler";

export const healthCheck = asyncHandler((req, res) => {
  res.log.info("Health Check");
  res.send("Api is Healthy!");
});
