import React, { FormEvent, useState } from "react";
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
import axios from "axios";

function parseUrl(url: string) {
  if (!url.startsWith("https://")) {
    url = `https://${url}`;
  }

  // Do not modify if the URL is already in raw Gist format
  if (url.startsWith("https://gist.githubusercontent.com")) {
    return url;
  }

  // Handle Gist URLs
  if (url.startsWith("https://gist.github.com")) {
    // Convert the URL to raw Gist format
    const gistRawLink = url
      .replace("gist.github.com", "gist.githubusercontent.com")
      .concat("/raw");
    return gistRawLink;
  }

  if (
    !url.startsWith("https://github.com/") &&
    !url.startsWith("https://raw.githubusercontent.com/")
  ) {
    toast("Please provide a valid GitHub URL");
    return;
  }

  // Convert regular GitHub URLs to raw format
  const rawLink = url
    .replace("github.com", "raw.githubusercontent.com")
    .replace("/blob/", "/");

  return rawLink;
}

export default function UploadCodeFromGithub({
  setCode,
}: {
  setCode: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [githubUrl, setGithubUrl] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function handleSubmit() {
    if (!githubUrl) {
      toast.error("Github Url is required to upload code from Github.");
      return;
    }

    const rawLink = parseUrl(githubUrl);
    if (!rawLink) return;

    const toastPromise = axios.get(rawLink).then((res) => {
      setCode(res.data);
      setGithubUrl("");
    });

    toast.promise(toastPromise, {
      loading: "Uploading code from github...",
      success: "Code uploaded successfully",
      error: "Failed to upload code",
    });
  }

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        radius="md"
        size="sm"
        type="button"
      >
        <UploadIcon />
        Upload from Github
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload Code from Github
              </ModalHeader>
              <div>
                <ModalBody>
                  <p className="text-sm text-gray-700">
                    Enter the github url of the file that you want to upload,
                    the repository must be public for this to work.
                  </p>
                  <Input
                    // type="url"
                    label="Github Url"
                    required
                    placeholder="github.com/username/repository/blob/main/file"
                    labelPlacement="outside"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-small text-default-400">
                          https://
                        </span>
                      </div>
                    }
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    type="button"
                    onPress={onClose}
                    onClick={handleSubmit}
                  >
                    Upload
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
