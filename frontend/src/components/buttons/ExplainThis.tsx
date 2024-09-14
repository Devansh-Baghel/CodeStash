import { useUserStore } from "@/store/userStore";
import { PostTypes } from "@/types/postTypes";
import { axiosInstance } from "@/utils/axios";
import { Button } from "@nextui-org/react";
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
  const router = useRouter();
  function getAiAnswer() {
    // TODO: add this feature of ai answer
    const aiAnswerPromise = axiosInstance
      .get("/ai/explain", { params: { postId } })
      .then((res) => {
        setAiAnswer(res.data.data.aiAnswer);
        router.push(`#ai-explanation`);
      });

    toast.promise(aiAnswerPromise, {
      loading: "Generating AI Explanation...",
      success: "Generated AI Explanation",
      error: "Failed to get AI explanation",
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
