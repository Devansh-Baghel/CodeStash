import { useUserStore } from "@/store/userStore";
import { axiosInstance } from "@/utils/axios";
import { infoToast } from "@/utils/constants";
import formbricks from "@formbricks/js";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsStars as StarsIcon } from "react-icons/bs";
import MutationButton from "./MutationButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function AiAnswerCard({
  aiAnswer,
  setAiAnswer,
  postId,
}: {
  postId: string;
  aiAnswer?: string;
  setAiAnswer: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const { isLoggedIn } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function getAiAnswer() {
    if (!isLoggedIn) {
      infoToast(
        "You must be logged in to use AI features. Login as a demo user to test this feature.",
      );
      return;
    }

    setIsLoading(true);

    const aiAnswerPromise = axiosInstance
      .get("/ai/explain", { params: { postId } })
      .then((res) => {
        setAiAnswer(res.data.data.aiAnswer);
        setIsLoading(false);
        formbricks.track("ai_answer");
        router.push(`#ai-explanation`);
      });

    toast.promise(aiAnswerPromise, {
      loading: "Generating AI Explanation...",
      success: "Generated AI Explanation",
      error: "Our AI is currently under heavy load. Please try again later.",
    });
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-col text-center">
        <CardTitle className="text-xl">✨ AI Explanation ✨</CardTitle>
      </CardHeader>
      <CardContent className="max-w-[700px]" data-color-mode="light">
        {aiAnswer ? (
          <MarkdownPreview source={aiAnswer} />
        ) : (
          <div className="flex w-full items-center justify-center">
            <MutationButton
              onClick={getAiAnswer}
              isPending={isLoading}
              id="ai-button"
            >
              {isLoading ? "Getting" : "Get"} AI Explanation
              <StarsIcon className="size-5" />
            </MutationButton>
          </div>
        )}
      </CardContent>
      {aiAnswer && (
        <CardFooter className="flex justify-center text-sm font-semibold">
          Note that AI models are not perfect and may make mistakes.
        </CardFooter>
      )}
    </Card>
  );
}
