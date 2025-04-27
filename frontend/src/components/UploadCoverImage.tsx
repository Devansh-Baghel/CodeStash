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
} from "@heroui/react";
import toast from "react-hot-toast";
import { axiosInstance } from "@/utils/axios";
import Link from "next/link";
import { FiExternalLink as LinkIcon } from "react-icons/fi";
import { FaRegImage as CoverImageIcon } from "react-icons/fa";

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
      <Button onPress={onOpen} color="primary" radius="md" size="sm">
        <CoverImageIcon />
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
                  <p>4 : 1 image ratio recommended.</p>
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
