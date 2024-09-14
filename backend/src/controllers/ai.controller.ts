import { Post } from "../models/post.model";
import { UserRequest } from "../types/userTypes";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { GoogleGenerativeAI } from "@google/generative-ai";

const githubAlerts = `
> 
> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
`;

export const getAiAnswer = asyncHandler(async (req: UserRequest, res) => {
  const { postId } = req.query;

  if (!postId) {
    return new ApiError(400, "Post id is required to get comments");
  }

  const post = await Post.findById(postId);

  if (!post) throw new ApiError(404, "Post with this id does not exist");

  const apiKey = process.env.GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [],
  });

  const prompt = `I am providing you a code snippet, please explain me this code snippet, only give small and consice explanation, only give answers in valid markdown format, make sure to use markdown format extensively, if possible use indenting in the markdown in bullet points etc. Make sure to include EXACTLY ONE (choose between NOTE, TIP, IMPORTANT, WARNING, CAUTION depending on your explanation of the code, only use CAUTION and WARNING when there is a severe problem in the code) of the following github alerts at the top of your response, in this exact format including > symbol: ${githubAlerts}. The code snippet is: ${post.content}`;

  const result = await chatSession.sendMessage(prompt);
  console.log(result.response.text());
  const aiAnswer = result.response.text();

  return res
    .status(200)
    .json(new ApiResponse(200, { aiAnswer }, "AI answer sent successfully"));
});
