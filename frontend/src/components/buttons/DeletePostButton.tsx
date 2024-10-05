import { queryClient } from "@/app/providers";
import { Button as ShadButton } from "@/components/ui/button";
import fetcher from "@/utils/axios";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MdDelete as DeleteIcon } from "react-icons/md";

export default function DeletePostButton({ postId }: { postId: string }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();
  const { mutate: deletePost } = useMutation({
    mutationKey: ["delete-post"],
    onSuccess: () => {
      queryClient.invalidateQueries();
      router.push("/");
    },
    mutationFn: async () => {
      const deletePostPromise = fetcher.post("/posts/delete-post", { postId });

      toast.promise(deletePostPromise, {
        loading: "Deleting post...",
        success: "Deleted post successfully",
        error: "Failed to delete post",
      });

      onClose();

      return deletePostPromise;
    },
  });

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
                <Button color="primary" onClick={() => deletePost()}>
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
