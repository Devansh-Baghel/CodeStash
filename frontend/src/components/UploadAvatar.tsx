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

export default function UploadAvatar({ buttonText }: { buttonText: string }) {
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

    const toastPromise = axiosInstance
      .post("/users/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setUserData(res.data.data.user);
      });

    toast.promise(toastPromise, {
      loading: "Saving Avatar",
      success: "Saved Avatar",
      error: "Error saving avatar",
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
              <form onSubmit={uploadAvatar}>
                <ModalBody>
                  <Input
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
