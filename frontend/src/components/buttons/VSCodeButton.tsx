import { Button } from "@nextui-org/react";
import { useState } from "react";
import { IoCodeDownload as DownloadIcon } from "react-icons/io5";
import { VscVscode as VSCodeIcon } from "react-icons/vsc";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type VSCodeButtonProps = {
  snippet: string;
  fileName: string;
  fileType: string;
};

function getFileExtension(language: string): string | null {
  switch (language.toLowerCase()) {
    case "javascript":
      return "js";
    case "python":
      return "py";
    case "typescript":
      return "ts";
    case "ruby":
      return "rb";
    case "java":
      return "java";
    case "cpp":
      return "cpp";
    case "go":
      return "go";
    case "php":
      return "php";
    case "swift":
      return "swift";
    default:
      return null; // return null if the language is not allowed
  }
}

export default function VSCodeButton({
  snippet,
  fileName,
  fileType,
}: VSCodeButtonProps) {
  const fileExtension = getFileExtension(fileType);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  function downloadFile() {
    const blob = new Blob([snippet], { type: `text/${fileType}` });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setHasDownloaded(true);
  }

  //  TODO: better ui for this button
  return (
    <div className="flex gap-2 self-end">
      <Button
        color="success"
        radius="full"
        // variant="flat"
        size="sm"
        onClick={downloadFile}
      >
        <DownloadIcon className="size-6" />
        Download
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              color="primary"
              radius="full"
              //   variant="flat"
              size="sm"
              disabled={!hasDownloaded}
            >
              <VSCodeIcon className="size-6" />
              Open in VS Code
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-background text-primary">
            <p>You need to download the file first</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
