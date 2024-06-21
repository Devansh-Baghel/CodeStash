"use client";

import NotLoggedIn from "@/components/NotLoggedIn";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import fetcher from "@/utils/axios";
import { useRouter } from "next/navigation";

export default function CreateCommunity() {
  const { isLoggedIn } = useUserStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  async function createCommunity(e: FormEvent) {
    e.preventDefault();

    if (!name || !description) {
      toast({
        description: "Name and description are required to create a community",
      });
      return;
    }

    await fetcher
      .post("/community/create-community", { name, description })
      .then((res) => {
        console.log(res);

        toast({
          description: `Created c/${name} community successfully`,
        });

        router.push(`/c/${name}`);

        setName("");
        setDescription("");
      })
      .catch((error) => {
        if (error.response.status === 409) {
          toast({
            description: "A community with this name already exists",
          });
        }
      });
  }

  if (!isLoggedIn) {
    return <NotLoggedIn description="Login or sign up to create communities" />;
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create Community</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={createCommunity}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name of the community{" "}
                <span className="text-xs text-gray-600">(must be unique)</span>
              </Label>
              <Input
                id="name"
                placeholder="react-server-components"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                placeholder="Explain about your community"
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Create community
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
