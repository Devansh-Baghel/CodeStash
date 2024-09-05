"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BiLoaderAlt as Loader } from "react-icons/bi";

import NotLoggedIn from "@/components/NotLoggedIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { useMutation } from "@tanstack/react-query";
import useTitle from "@/hooks/useTitle";

export default function CreateCommunity() {
  useTitle("Create Community");

  const { isLoggedIn, setUserData } = useUserStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-community"],
    mutationFn: async () => {
      return await fetcher
        .post("/community/create-community", { name, description })
        .then((res) => {
          setUserData(res.user);

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
    },
  });

  async function createCommunity(e: FormEvent) {
    e.preventDefault();

    if (!name || !description) {
      toast({
        description: "Name and description are required to create a community",
      });
      return;
    }

    mutate();
  }

  if (!isLoggedIn) {
    return (
      <NotLoggedIn
        title="Create Community"
        description="Login or sign up to create communities"
      />
    );
  }

  return (
    <Card className={cn(cardLayout)}>
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
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
