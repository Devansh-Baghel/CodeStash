"use client";

import fetcher from "@/utils/axios";
import { Button, Textarea } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormEvent, useState } from "react";

export default function Comments({ postId }: { postId: string }) {
  const [comment, setComment] = useState("");
  const { data, isError, isLoading, refetch, isRefetchError, isRefetching } =
    useQuery({
      queryKey: [`${postId}/comments`],
      queryFn: async () => {
        return await fetcher.post("/comments/get-comments", { postId });
      },
    });
  const { mutateAsync } = useMutation({
    mutationKey: [`${postId}/comments`],
    mutationFn: async () => {
      return await fetcher.put("/comments/create-comment", {
        postId,
        content: comment,
      });
    },
  });
  async function addComment(e: FormEvent) {
    e.preventDefault();
    if (!comment) return;

    await mutateAsync();
    refetch();
    setComment("");
  }

  if (isError || isRefetchError) return "Error";
  if (isLoading) return "Loading...";

  return (
    <Card className="my-6">
      <CardHeader className="">
        <CardTitle>Comments</CardTitle>
        <form onSubmit={addComment}>
          <Textarea
            variant="underlined"
            required
            color="primary"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            // label="Description"
            // labelPlacement="outside"
            placeholder="Add a comment"
            className={`col-span-12 mb-3 md:col-span-6 md:mb-0 ${!comment && "h-10"}`}
          />
          {comment && (
            <Button color="primary" type="submit">
              Add comment
            </Button>
          )}
        </form>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          <ul>
            {/* TODO: show loading when refetching for new comments */}
            {/* FIXME: add comment types */}
            {data?.map((comment) => (
              <li key={comment._id}>{comment.content}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
