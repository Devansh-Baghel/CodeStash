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
import { useState } from "react";
import { FaGears as AccountOptionsIcon } from "react-icons/fa6";
import { Label } from "./ui/label";

export default function CommunityOptionsModal({
  community,
}: {
  community: CommunityTypes;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [description, setDescription] = useState(community.description);

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
              <form>
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
                  <Button color="primary" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
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
