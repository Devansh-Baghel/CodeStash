"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<undefined | string>();
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const { isLoggedIn } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    fetcher
      .post("/posts/create-post", {
        content: code,
        language,
        description,
        title,
      })
      .then((res) => {
        console.log(res);
        setTitle("");
        setCode("");
        setDescription("");

        toast({
          title: "Post Created",
          description: `Your post in ${language} was created successfully.`,
        });
      });
  }

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create Post</CardTitle>
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
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
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
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
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
