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
import { useUserStore } from "@/store/userStore";
import { FaImagePortrait as AvatarIcon } from "react-icons/fa6";

export default function UploadAvatar({
  buttonText,
  type,
  communityName,
  refetch,
}: {
  buttonText: string;
  communityName?: string;
  refetch?: () => void;
  type: "user" | "community";
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [avatar, setAvatar] = useState<File>();
  const { setUserData } = useUserStore();

  function uploadAvatar(e: FormEvent) {
    e.preventDefault();

    if (!avatar) {
      toast.error("Please upload avatar file");
      return;
    }

    if (!["image/jpeg", "image/png"].includes(avatar?.type)) {
      toast.error("Only jpeg and png files are allowed");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

    let postRoute;
    if (type === "user") {
      postRoute = "/users/upload-avatar";
    } else {
      postRoute = "/community/upload-avatar";
      formData.append("name", communityName!);
    }

    const toastPromise = axiosInstance
      .post(postRoute, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (type === "user") setUserData(res.data.data.user);
        else refetch!();
      });

    toast.promise(toastPromise, {
      loading: "Saving avatar...",
      success: "Saved avatar",
      error: "Error saving avatar",
    });
  }

  return (
    <>
      <Button onPress={onOpen} color="primary" radius="md" size="sm">
        <AvatarIcon />
        {buttonText}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {buttonText}
              </ModalHeader>
              <form onSubmit={uploadAvatar}>
                <ModalBody>
                  <p>1 : 1 image ratio recommended.</p>
                  <Input
                    color="primary"
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                      if (!e.target.files) return;
                      setAvatar(e.target.files[0]);
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
