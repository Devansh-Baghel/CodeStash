import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@nextui-org/react";

export default function UserProfile({
  params,
}: {
  params: { userName: string };
}) {
  // TODO: fetch the user by username
  // If username === useUserStore().username then redirect to /profile

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex gap-1"></div>
        <div>
          <Avatar src="" size="lg" className="mx-auto h-32 w-32" />
          <CardTitle className="">{params.userName}</CardTitle>
          <CardDescription></CardDescription>
        </div>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex flex-col gap-2"></CardFooter>
    </Card>
  );
}
