import { Button as ShadButton } from "@/components/ui/button";
import { MdDelete as DeleteIcon } from "react-icons/md";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import fetcher from "@/utils/axios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

export default function DeletePostButton({ postId }: { postId: string }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();

  function deletePost() {
    const deletePostPromise = fetcher
      .post("/posts/delete-post", { postId })
      .then(() => {
        router.push("/");
      });

    toast.promise(deletePostPromise, {
      loading: "Deleting post...",
      success: "Deleted post successfully",
      error: "Failed to delete post",
    });

    onClose();
  }

  return (
    <>
      <ShadButton
        className="text-sm text-black hover:text-red-500"
        variant="link"
        size="sm"
        onClick={onOpen}
      >
        <DeleteIcon className="mr-1 size-4" />
        Delete Post
      </ShadButton>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure that you want to delete this post?
              </ModalHeader>
              <ModalBody>
                <p>
                  This action cannot be undone. This will permanently delete
                  your post and all its comments.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onClick={deletePost}>
                  Delete Post
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
