import { useUserStore } from "@/store/userStore";
import { axiosInstance } from "@/utils/axios";
import { infoToast } from "@/utils/constants";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { BsStars as StarsIcon } from "react-icons/bs";

export default function ExplainThisButton({
  postId,
  setAiAnswer,
}: {
  postId: string;
  setAiAnswer: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const { isLoggedIn } = useUserStore();
  const router = useRouter();
  function getAiAnswer() {
    if (!isLoggedIn) {
      infoToast(
        "You must be logged in to use AI features. Login as a demo user to test this feature.",
      );
      return;
    }

    const aiAnswerPromise = axiosInstance
      .get("/ai/explain", { params: { postId } })
      .then((res) => {
        setAiAnswer(res.data.data.aiAnswer);
        router.push(`#ai-explanation`);
      });

    toast.promise(aiAnswerPromise, {
      loading: "Generating AI Explanation...",
      success: "Generated AI Explanation",
      error: "Our AI is currently under heavy load. Please try again later.",
    });
  }

  return (
    <Button
      className="mb-2"
      color="primary"
      variant="flat"
      onClick={getAiAnswer}
    >
      <StarsIcon className="size-5" />
      Explain this
    </Button>
  );
}
