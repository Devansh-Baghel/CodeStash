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

export default function UpdateUsername() {
  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Update Username</CardTitle>
        <CardDescription>Create a new username below</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid gap-2">
            <Label htmlFor="email">New username</Label>
            <div className="flex items-center justify-center gap-4">
              <Input
                id="username"
                placeholder="thorfinn"
                autoComplete="username"
                required
                //   value={email}
                //   onChange={(e) => setEmail(e.target.value)}
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
