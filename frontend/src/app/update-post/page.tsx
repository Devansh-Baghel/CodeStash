"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import NotLoggedIn from "@/components/NotLoggedIn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { PostTypes } from "@/types/postTypes";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { Button } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { allowedLanguages } from "@/utils/constants";
import { toast as rhToast } from "react-hot-toast";
import UploadCodeFromGithub from "@/components/buttons/UploadCodeFromGithub";
import UploadCodeFromFile from "@/components/buttons/UploadCodeFromFile";

export default function UpdatePost() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState(
    searchParams.get("language") ? searchParams.get("language") : "",
  );
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const { isLoggedIn } = useUserStore();
  const router = useRouter();
  const {
    data: post,
    isError,
    isLoading,
  } = useQuery<PostTypes>({
    queryKey: [postId],
    queryFn: async () => {
      return await fetcher.post("/posts/get-post", { postId }).then((res) => {
        console.log(res);
        setCode(res.content);
        setDescription(res.description);
        setTitle(res.title);
        setLanguage(res.language);
        return res;
      });
    },
  });
  const { mutate, isPending } = useMutation({
    mutationKey: [postId],
    mutationFn: async () => {
      return await fetcher
        .patch("/posts/update-post", {
          postId: post?._id,
          content: code,
          language,
          description,
          title,
        })
        .then((res) => {
          toast({
            title: "Post Updated",
            description: `You post in c/${post?.community} has been updated successfully`,
          });

          router.push(`/post/${post?._id}`);
        });
    },
  });

  if (!postId) {
    router.push("/create-post");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!language) {
      toast({
        title: "Programming language not selected",
        description: "Please select a programming language to update this post",
      });
      return;
    }

    if (code.length > 9_000) {
      rhToast.error("Code is too long. Please keep it under 9,000 characters.");
      return;
    }

    if (
      language === post?.language &&
      code === post?.content &&
      title === post?.title &&
      description === post?.description
    ) {
      toast({
        description: "You haven't updated anything yet",
      });
      return;
    }

    mutate();
  }

  if (!isLoggedIn) {
    return (
      <NotLoggedIn
        title="Update Post"
        description="Login or sign up to update posts"
      />
    );
  }

  // TODO: add better looking error here
  if (isError) return "Error";
  // TODO: add loading skeletons
  if (isLoading) return "Loading...";

  return (
    <Card className={cn(cardLayout, "mx-auto")}>
      <CardHeader>
        <CardTitle className="text-2xl">Update Post</CardTitle>
        <CardDescription>
          You are updating a post in{" "}
          <Link href={`/c/${post?.community}`} className="underline">
            c/{post?.community}
          </Link>
          {post?.community === "all" && (
            <span className="text-xs"> (default community)</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="React server component"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Programming Language</Label>
              <Select
                required
                onValueChange={(lang) => setLanguage(lang)}
                value={language!}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {[...allowedLanguages].map((lang) => (
                    <SelectItem value={lang} key={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              {/* TODO: Make this WYSIWYG editor */}
              <Label htmlFor="description">Description</Label>
              <Textarea
                placeholder="How is this code snippet useful?"
                id="description"
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-end justify-between gap-4">
                <Label htmlFor="content">Code</Label>
                <div className="flex gap-4">
                  <UploadCodeFromGithub setCode={setCode} />
                  <UploadCodeFromFile setCode={setCode} />
                </div>
              </div>
              <CodeEditor
                value={code}
                language={language || "python"}
                placeholder={
                  language ? `Please enter ${language} code` : "Enter code here"
                }
                onChange={(evn) => setCode(evn.target.value)}
                className="rounded-xl"
                required
                data-color-mode="dark"
                padding={15}
                style={{
                  fontFamily:
                    "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                }}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              color="primary"
              isLoading={isPending}
            >
              Update post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
