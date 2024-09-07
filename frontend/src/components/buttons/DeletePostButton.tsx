import { Button as ShadButton } from "@/components/ui/button";
import { MdDelete as DeleteIcon } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import fetcher from "@/utils/axios";

export default function DeletePostButton({ postId }: { postId: string }) {
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
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ShadButton
          className="text-sm text-black hover:text-red-500"
          variant="link"
          size="sm"
        >
          <DeleteIcon className="mr-1 size-4" />
          Delete Post
        </ShadButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure that you want to delete this post?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your post
            and all its comments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deletePost}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
