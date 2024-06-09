import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@nextui-org/react";
import { BiUpvote as UpvoteIcon } from "react-icons/bi";
import { BiDownvote as DownvoteIcon } from "react-icons/bi";

// mock post
const post = {
  _id: "snpt001",
  title: "QuickSort Algorithm in Python",
  content:
    "def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)",
  description: "An efficient sorting algorithm implemented in Python.",
  madeBy: {
    userId: "u12345",
    fullname: "Alice Johnson",
  },
  upvotes: 124,
  downvotes: 3,
};

export default async function Post({ params }: { params: { postId: string } }) {
  // await new Promise((resolve) => setTimeout(resolve, 5000));

  return (
    <Card key={post._id}>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex gap-1">
          {/* FIXME: Change to solid verison of these icons when clicked */}
          <UpvoteIcon className="h-6 w-6" />
          {post.upvotes - post.downvotes}
          <DownvoteIcon className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="">{post.title}</CardTitle>
          <CardDescription>{post.madeBy.fullname}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p>{post.description}</p>
        <br />
        {/* FIXME: Change this textarea to a proper code block with syntax highlighting */}
        <Textarea
          isReadOnly
          label="Code"
          variant="bordered"
          labelPlacement="outside"
          placeholder="Enter your description"
          defaultValue={post.content}
          className="min-h-full"
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p>Posted in {post._id} community</p>
      </CardFooter>
    </Card>
    // TODO: Add comments and replies for these posts
  );
}
