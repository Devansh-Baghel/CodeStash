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
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosPromise } from "axios";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { mutateAsync, isPending, error } = useMutation<any, AxiosError>({
    mutationKey: ["update-password"],
    mutationFn: () => {
      return fetcher
        .patch("/users/update-password", {
          newPassword,
          oldPassword,
        })
        .then(() => {
          setOldPassword("");
          setNewPassword("");
        });
    },
  });

  async function updatePassword(e: FormEvent) {
    e.preventDefault();
    if (oldPassword === newPassword) {
      // FIXME: add "info" toast like in spendsync
      toast.error("New password can't be the same as the current password");
      return;
    }
    const updatePasswordPromise = mutateAsync();

    toast.promise(updatePasswordPromise, {
      loading: "Changing current password",
      success: "Changed password successfully",
      error:
        error?.response?.status === 401
          ? "Invalid current password"
          : "Failed to change current password",
    });
  }

  return (
    <Card className="mx-auto" id="change-password">
      <CardHeader>
        <CardTitle className="text-xl">Change Password</CardTitle>
        <CardDescription>
          Enter your old password and create a new password to update.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={updatePassword} className="grid max-w-[400px] gap-4">
          <div>
            <Label htmlFor="old-password">Current Password</Label>
            <Input
              id="old-password"
              autoComplete="current-password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-40" disabled={isPending}>
            {isPending && <Loader className="mr-2 size-4 animate-spin" />}
            Update
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
