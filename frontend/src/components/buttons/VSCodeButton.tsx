import { Button, Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { IoCodeDownload as DownloadIcon } from "react-icons/io5";
import { VscVscode as VSCodeIcon } from "react-icons/vsc";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import toast from "react-hot-toast";

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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filePath, setFilePath] = useState<File>();

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

    toast.success("File downloaded successfully");
  }

  function openInVSCode(e: FormEvent) {
    e.preventDefault();
    if (!filePath) {
      toast.error("File path is required to open the snippet in VS Code");
      return;
    }
    console.log(filePath);
    // window.location.href = `vscode://file${filePath}`;
  }

  //  TODO: better ui for this button
  return (
    <div className="flex gap-2 self-end">
      <Button
        color="success"
        radius="full"
        variant="flat"
        size="sm"
        onClick={downloadFile}
      >
        <DownloadIcon className="size-6" />
        {/* <VSCodeIcon className="size-6" /> */}
        Download
      </Button>

      <Button
        color="primary"
        radius="full"
        variant="flat"
        size="sm"
        // onPress={onOpen}
        onClick={() => toast("This feature isn't implemented yet")}
      >
        <VSCodeIcon className="size-6" />
        Open in VS Code
      </Button>

      {/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <VSCodeIcon className="size-6 text-primary" />
                Download & Open in VS Code
              </ModalHeader>
              <form onSubmit={openInVSCode}>
                <ModalBody>
                  <Button color="success" radius="md" onClick={downloadFile}>
                    <DownloadIcon className="size-6" />
                    Download File
                  </Button>
                  <p>Select the file that you just downloaded.</p>
                  <Input
                    color="primary"
                    type="file"
                    id="code"
                    name="code"
                    required
                    onChange={(e) => {
                      if (!e.target.files) return;
                      setFilePath(e.target.files[0]);
                    }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose} type="submit">
                    Open in VS Code
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </div>
  );
}
