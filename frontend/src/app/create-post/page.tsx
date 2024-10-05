"use client";

import UploadCodeFromFile from "@/components/buttons/UploadCodeFromFile";
import UploadCodeFromGithub from "@/components/buttons/UploadCodeFromGithub";
import MutationButton from "@/components/MutationButton";
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
import useTitle from "@/hooks/useTitle";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { allowedLanguages } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import CodeEditor from "@uiw/react-textarea-code-editor";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast as rhToast } from "react-hot-toast";
import { queryClient } from "../providers";

export default function CreatePost() {
  useTitle("Create Post");

  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState(
    searchParams.get("language") ? searchParams.get("language") : "",
  );
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const { isLoggedIn, userData } = useUserStore();
  const [community, setCommunity] = useState(searchParams.get("community"));
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-post"],
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      setTitle("");
      setCode("");
      setDescription("");

      toast({
        title: "Post Created",
        description: `Your post in c/${community} written in ${language} was created successfully.`,
      });

      router.push(`/post/${data._id}`);
    },
    mutationFn: () => {
      return fetcher.post("/posts/create-post", {
        content: code,
        language,
        description,
        title,
        community,
      });
    },
  });

  if (!community) setCommunity("all");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!language) {
      toast({
        title: "Programming language not selected",
        description: "Please select a programming language to create a post",
      });
      return;
    }

    if (code.length > 9_000) {
      rhToast.error("Code is too long. Please keep it under 9,000 characters.");
      return;
    }

    if (!userData?.communitiesJoined.includes(community!)) {
      // FIXME: add better looking toasts
      toast({
        title: "You haven't joined this community yet",
        description: `Cannot create post in c/${community}.`,
      });

      return;
    }

    mutate();
  }

  if (!isLoggedIn) {
    return (
      <NotLoggedIn
        title="Create Post"
        description="Login or sign up to create posts"
      />
    );
  }

  // TODO: better ui for this
  if (!userData?.communitiesJoined.includes(community!))
    return (
      <Card className={cn(cardLayout)}>
        <CardHeader>
          <CardTitle>
            You can&apos;t create a post in c/{community} before joining it
          </CardTitle>
        </CardHeader>
      </Card>
    );

  return (
    <Card className={cn(cardLayout, "mx-auto")}>
      <CardHeader>
        <CardTitle className="text-2xl">Create Post</CardTitle>
        <CardDescription>
          You are creating a post in{" "}
          <Link href={`/c/${community}`} className="underline">
            c/{community}
          </Link>
          {community === "all" && (
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
            {/* <div> */}
            {/* </div> */}
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
            <MutationButton type="submit" isPending={isPending}>
              Create post in c/{community}
            </MutationButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
