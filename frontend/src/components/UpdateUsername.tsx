import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import fetcher from "@/utils/axios";
import { FormEvent, useState } from "react";
import { toast } from "./ui/use-toast";
import { useUserStore } from "@/store/userStore";

export default function UpdateUsername() {
  const [newUsername, setNewUsername] = useState("");
  const { setUserData } = useUserStore();

  async function updateUsername(e: FormEvent) {
    e.preventDefault();

    await fetcher
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
  }

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Update Username</CardTitle>
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
              <Button type="submit" className="w-60">
                Update Username
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
