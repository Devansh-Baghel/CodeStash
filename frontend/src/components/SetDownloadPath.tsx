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
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function SetDownloadPath() {
  const [downloadPath, setDownloadPath] = useState("");
  const { userData, setUserData } = useUserStore();
  const { mutate, isPending } = useMutation({
    mutationKey: ["set-download-path"],
    mutationFn: () => {
      const setDownloadPathPromise = fetcher
        .patch("/users/set-download-path", {
          downloadPath,
        })
        .then((res) => {
          setUserData(res.updatedUser);
          setDownloadPath("");
        });

      toast.promise(setDownloadPathPromise, {
        loading: "Setting download path...",
        success: "Download path updated successfully",
        error: "Failed to set download path",
      });

      return setDownloadPathPromise;
    },
  });

  function setPath(e: FormEvent) {
    e.preventDefault();
    mutate();
  }

  return (
    <Card className="mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-xl">
          {userData?.downloadPath ? "Change" : "Set"} Download Path for VS Code
        </CardTitle>
        <CardDescription>
          This is required to open files in VS Code. Make sure the folder
          exists.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={setPath}>
          <div className="grid gap-2">
            <Label htmlFor="email">Download Path</Label>
            <div className="flex items-center justify-center gap-4">
              <Input
                id="username"
                placeholder="Enter absolute folder path (e.g., C:/Users/...)"
                autoComplete="username"
                required
                value={downloadPath}
                onChange={(e) => setDownloadPath(e.target.value)}
              />
              <Button type="submit" className="w-40" disabled={isPending}>
                {isPending && <Loader className="mr-2 size-4 animate-spin" />}
                Save
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
