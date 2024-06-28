"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { FormEvent, useEffect, useState } from "react";
import fetcher from "@/utils/axios";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/userStore";
import NotLoggedIn from "@/components/NotLoggedIn";
import { cn } from "@/lib/utils";
import { cardLayout } from "@/utils/classnames";
import { allowedLanguages } from "../languages/page";
import { useSearchParams } from "next/navigation";

// TODO: add community option in this form
// this page take a query param ?community in which if no community is passed
// then it by default creates a post in c/all or just no community
// and if the prop is passed then it makes a post in that community

// or just have a dropdown to select the community that the user wants to post in and have a none option there
export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<undefined | string>();
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const { isLoggedIn, userData } = useUserStore();
  const searchParams = useSearchParams();
  const [community, setCommunity] = useState(searchParams.get("community"));

  if (!community) setCommunity("all");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!userData?.communitiesJoined.includes(community!)) {
      // FIXME: add better looking toasts
      toast({
        title: "You haven't joined this community yet",
        description: `Cannot create post in c/${community}.`,
      });

      return;
    }

    fetcher
      .post("/posts/create-post", {
        content: code,
        language,
        description,
        title,
        community,
      })
      .then((res) => {
        console.log(res);
        setTitle("");
        setCode("");
        setDescription("");

        toast({
          title: "Post Created",
          description: `Your post in c/${community} written in ${language} was created successfully.`,
        });
      });
  }

  if (!isLoggedIn) {
    return <NotLoggedIn description="Login or sign up to create posts" />;
  }

  return (
    <Card className={cn(cardLayout, "mx-auto")}>
      <CardHeader>
        <CardTitle className="text-2xl">Create Post</CardTitle>
        <CardDescription>
          You are creating a post in{" "}
          <Link href={`/c/${community}`} className="underline">
            c/{community}
          </Link>
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
              <Select
                required
                onValueChange={(lang) => setLanguage(lang)}
                value={language}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem> */}
                  {[...allowedLanguages].map((lang) => (
                    <SelectItem value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              {/* TODO Make this WYSIWYG editor */}
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
              <Label htmlFor="content">Code</Label>
              <CodeEditor
                value={code}
                language={language || "python"}
                placeholder={`Please enter ${language || "python"} code`}
                onChange={(evn) => setCode(evn.target.value)}
                className="rounded-xl"
                required
                padding={15}
                style={{
                  fontFamily:
                    "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                }}
              />
            </div>
            <Button type="submit" className="w-full">
              Create post
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {/* FIXME: fix this */}
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
