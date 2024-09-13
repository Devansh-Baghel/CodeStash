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
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

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
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const { userData } = useUserStore();
  const router = useRouter();

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
    setHasDownloaded(true);
  }

  function handleModalOpen() {
    if (!userData?.downloadPath) {
      // TODO: maybe make all toasts custom
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} flex items-center justify-center gap-4 rounded-xl bg-white px-6 py-2 shadow-xl`}
          >
            <span>
              <span className="mr-4">📌</span> You need to set the download path
              first in Account Settings
            </span>
            <Button
              onClick={() => router.push("/settings")}
              size="sm"
              color="primary"
              radius="full"
            >
              Account Settings
            </Button>
          </div>
        ),
        {
          id: "download-path-not-set",
        },
      );
      return;
    }
    onOpen();
  }

  function openInVSCode() {
    if (!userData?.downloadPath) {
      // TODO: in this toast add a link to /settings
      toast.custom(
        <div>
          You need to set the download path first in Account Settings
          <Button onClick={() => router.push("/settings")}>
            Account Settings
          </Button>
        </div>,
      );
      return;
    }
    if (!hasDownloaded) {
      toast.error("You need to download the file first");
      return;
    }
    if (userData.downloadPath.endsWith("/")) {
      window.location.href = `vscode://file${userData.downloadPath}/${fileName}.${fileExtension}`;
    } else if (userData.downloadPath.endsWith("\\")) {
      window.location.href = `vscode://file${userData.downloadPath}\\${fileName}.${fileExtension}`;
    } else {
      window.location.href = `vscode://file${userData.downloadPath}/${fileName}.${fileExtension}`;
    }
  }

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
        Download
      </Button>

      <Button
        color="primary"
        radius="full"
        variant="flat"
        size="sm"
        onPress={handleModalOpen}
      >
        <VSCodeIcon className="size-6" />
        Open in VS Code
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <VSCodeIcon className="size-6 text-primary" />
                Download & Open in VS Code
              </ModalHeader>
              <ModalBody>
                <p>You have to download the file before opening.</p>
                <Button
                  color={hasDownloaded ? "default" : "success"}
                  radius="md"
                  onClick={downloadFile}
                  disabled={hasDownloaded}
                >
                  <DownloadIcon className="size-6" />
                  {hasDownloaded ? "Downloaded!" : "Download File"}
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color={hasDownloaded ? "primary" : "default"}
                  onClick={openInVSCode}
                  type="submit"
                  disabled={!hasDownloaded}
                >
                  Open in VS Code
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
