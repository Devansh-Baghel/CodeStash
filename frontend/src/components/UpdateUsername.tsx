import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BiLoaderAlt as Loader } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import fetcher from "@/utils/axios";
import { FormEvent, useState } from "react";
import { toast } from "./ui/use-toast";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";

export default function UpdateUsername() {
  const [newUsername, setNewUsername] = useState("");
  const { setUserData } = useUserStore();
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-username"],
    mutationFn: () => {
      return fetcher
        .patch("/users/update-username", {
          newUsername,
        })
        .then((res) => {
          setUserData(res.updatedUser);
          setNewUsername("");

          toast({
            description: "Username updated successfully",
          });
        });
    },
  });

  function updateUsername(e: FormEvent) {
    e.preventDefault();
    mutate();
  }

  return (
    <Card className="mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Change Username</CardTitle>
        <CardDescription>Create a new username below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={updateUsername}>
          <div className="grid gap-2">
            <Label htmlFor="email">New username</Label>
            <div className="flex items-center justify-center gap-4">
              <Input
                id="username"
                placeholder="thorfinn"
                autoComplete="username"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <Button type="submit" className="w-40" disabled={isPending}>
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
