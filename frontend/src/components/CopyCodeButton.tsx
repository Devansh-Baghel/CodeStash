"use client";

import { Button } from "@nextui-org/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { LuClipboardCopy as CopyIcon } from "react-icons/lu";
import { LuClipboardCheck as CheckIcon } from "react-icons/lu";

export default function CopyCodeButton({ code }: { code: string }) {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  return (
    <Button
      variant="ghost"
      color="primary"
      radius="full"
      className="mt-6 w-full py-4 text-lg"
      onClick={() => copyToClipboard(code)}
    >
      {hasCopiedText ? (
        <>
          Copied!
          <CheckIcon className="h-5 w-5" />
        </>
      ) : (
        <>
          Copy to clipboard
          <CopyIcon className="h-5 w-5" />
        </>
      )}
    </Button>
  );
}
