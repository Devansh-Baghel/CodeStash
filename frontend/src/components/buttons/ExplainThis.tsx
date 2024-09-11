import { PostTypes } from "@/types/postTypes";
import { Button } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import { BsStars as StarsIcon } from "react-icons/bs";

export default function ExplainThisButton({ post }: { post: PostTypes }) {
  function getAiAnswer() {
    const toastId = toast.loading("Requesting AI...");
    // TODO: add this feature of ai answer
    // axios.post(webApiUrl, { headers: { Authorization: `Bearer ${tokenStr}` } });
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
