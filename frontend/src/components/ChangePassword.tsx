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

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-password"],
    mutationFn: () => {
      return fetcher
        .patch("/users/update-username", {
          newUsername,
        })
        .then((res) => {
          setOldPassword("");
          setNewPassword("");

          toast({
            description: "Username updated successfully",
          });
        });
    },
  });

  function updatePassword(e: FormEvent) {
    e.preventDefault();
    mutate();
  }

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Change Password</CardTitle>
        <CardDescription>
          Enter your old password and create a new password to update.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={updatePassword} className="grid max-w-[400px] gap-4">
          <div>
            <Label htmlFor="email">Old username</Label>
            <Input
              id="old-username"
              autoComplete="username"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">New username</Label>
            <Input
              id="username"
              autoComplete="username"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-40" disabled={isPending}>
            {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Update
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
