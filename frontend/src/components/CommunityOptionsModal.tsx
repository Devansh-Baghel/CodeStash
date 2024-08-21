import { CommunityTypes } from "@/app/communities/page";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Input,
} from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { FaGears as AccountOptionsIcon } from "react-icons/fa6";
import { Label } from "./ui/label";
import toast from "react-hot-toast";
import fetcher from "@/utils/axios";

export default function CommunityOptionsModal({
  community,
  description,
  setDescription,
}: {
  community: CommunityTypes;
  description: any;
  setDescription: any;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function updateDescription(e: FormEvent) {
    e.preventDefault();

    // FIXME: This doesn't work now
    if (!description) {
      toast.error("Description can't be empty");
      return;
    }

    const updateDescriptionPromise = fetcher.put("/community/update-info", {
      description,
      communityName: community.name,
    });

    toast.promise(updateDescriptionPromise, {
      loading: "Updating description...",
      success: "Updated description successfully",
      error: "Error updating description",
    });
  }

  return (
    <>
      <Button color="primary" variant="flat" radius="md" onPress={onOpen}>
        <AccountOptionsIcon />
        Options
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Community Options
              </ModalHeader>
              <form onSubmit={updateDescription}>
                <ModalBody>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    variant="bordered"
                    color="primary"
                    id="description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {/* <div>
                  <Button color="primary" variant="flat">
                    Upload community avatar
                  </Button>
                  <Button color="primary" variant="flat">
                    Upload cover image
                  </Button>
                  <Input type="file" />
                </div> */}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    variant="light"
                    onPress={onClose}
                    type="button"
                  >
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose} type="submit">
                    Save changes
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
