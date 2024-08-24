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
import { axiosInstance } from "@/utils/axios";
import Link from "next/link";
import { FiExternalLink as LinkIcon } from "react-icons/fi";

export default function UploadCoverImage({
  buttonText,
  communityName,
  refetch,
}: {
  buttonText: string;
  communityName: string;
  refetch: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [coverImage, setCoverImage] = useState<File>();

  function uploadCoverImage(e: FormEvent) {
    e.preventDefault();

    if (!coverImage) {
      toast.error("Please upload cover image file");
      return;
    }

    if (!["image/jpeg", "image/png"].includes(coverImage?.type)) {
      toast.error("Only jpeg and png files are allowed");
      return;
    }

    const formData = new FormData();
    formData.append("cover-image", coverImage);
    formData.append("name", communityName);

    const toastPromise = axiosInstance
      .post("/community/upload-cover-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        refetch();
      });

    toast.promise(toastPromise, {
      loading: "Saving cover image...",
      success: "Saved cover image",
      error: "Error saving cover image",
    });
  }

  return (
    <>
      <Button onPress={onOpen} color="primary">
        {buttonText}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {buttonText}
              </ModalHeader>
              <form onSubmit={uploadCoverImage}>
                <ModalBody>
                  <Link
                    className="text-primary underline"
                    target="_blank"
                    href="https://cdn.prod.website-files.com/616e938268c8f0a92cb2b540/650c62a94f0c738a7bd61397_Info.png"
                  >
                    Follow this guide for the best results.
                    <LinkIcon className="ml-1 inline" />
                  </Link>
                  <Input
                    color="primary"
                    type="file"
                    id="cover-image"
                    name="cover-image"
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                      if (!e.target.files) return;
                      setCoverImage(e.target.files[0]);
                    }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose} type="submit">
                    Save
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
