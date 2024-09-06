"use client";

import {
  LuClipboardCheck as CheckIcon,
  LuClipboardCopy as CopyIcon,
} from "react-icons/lu";

import { Button } from "@nextui-org/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";

export default function CopyCodeButton({ code }: { code: string }) {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  return (
    <Button
      // variant="ghost"
      color="primary"
      radius="full"
      // className="w-full py-4 text-lg"
      className="w-full"
      onClick={() => copyToClipboard(code)}
    >
      {hasCopiedText ? (
        <>
          <CheckIcon className="h-5 w-5" />
          Copied!
        </>
      ) : (
        <>
          <CopyIcon className="h-5 w-5" />
          Copy to clipboard
        </>
      )}
    </Button>
  );
}
