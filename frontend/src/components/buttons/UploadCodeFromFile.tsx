import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { MdOutlineUploadFile as UploadIcon } from "react-icons/md";
import { allowedLanguages } from "@/utils/constants";

// Map allowed languages to their file extensions
const languageExtensions = {
  javascript: [".js"],
  python: [".py"],
  typescript: [".ts"],
  ruby: [".rb"],
  java: [".java"],
  cpp: [".cpp", ".h"],
  go: [".go"],
  php: [".php"],
  swift: [".swift"],
};

export default function UploadCodeFromFile({
  setCode,
}: {
  setCode: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [file, setFile] = useState<File>();

  function handleSubmit() {
    if (!file) {
      toast.error("Please upload code file");
      return;
    }

    const fileName = file.name;
    const fileExtension = fileName
      .slice(fileName.lastIndexOf("."))
      .toLowerCase();

    // Check if the extension is allowed
    let isAllowed = false;
    for (const language of allowedLanguages) {
      if (languageExtensions[language].includes(fileExtension)) {
        isAllowed = true;
        break;
      }
    }

    if (isAllowed) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (!e.target) return;
        if (typeof e.target.result !== "string") return;
        setCode(e.target.result);
      };
      reader.readAsText(file);
    } else {
      toast.error("Invalid file type! Please upload a valid code file.");
    }
  }

  return (
    <>
      <Button onPress={onOpen} color="primary" radius="md" size="sm">
        <UploadIcon />
        Upload File
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload file
              </ModalHeader>
              <div>
                <ModalBody>
                  <p>Upload a valid code file.</p>
                  <Input
                    color="primary"
                    type="file"
                    id="code-file"
                    name="code-file"
                    onChange={(e) => {
                      if (!e.target.files) return;
                      setFile(e.target.files[0]);
                    }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    type="button"
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={onClose}
                    type="button"
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                </ModalFooter>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
