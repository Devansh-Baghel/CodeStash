import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack as BackIcon } from "react-icons/io";

import { Button } from "@nextui-org/react";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      className="mb-2"
      color="primary"
      variant="solid"
      onClick={router.back}
    >
      <BackIcon />
      Go back
    </Button>
  );
}
