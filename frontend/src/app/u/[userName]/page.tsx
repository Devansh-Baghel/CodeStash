import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import fetcher from "@/utils/axios";
import { Avatar } from "@nextui-org/react";

export default async function UserProfile({
  params,
}: {
  params: { userName: string };
}) {
  // TODO: fetch the user by username
  // If username === useUserStore().username then redirect to /profile

  // FIXME: add user types
  const user = await fetcher.post("/users/get-user-profile", {
    username: params.userName,
  });

  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-4">
        <Avatar src={user.avatar} size="lg" className="mx-auto h-32 w-32" />
        <CardTitle className="">{params.userName}</CardTitle>
        <CardDescription>
          {user.firstName} {user.lastName}
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex flex-col gap-2"></CardFooter>
    </Card>
  );
}
