"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import fetcher from "@/utils/axios";
import { cardLayout } from "@/utils/classnames";
import { Avatar } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

export default function Page({ params }: { params: { community: string } }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [`c/${params.community}`],
    queryFn: () => {
      return fetcher.post("/community/get-community", {
        name: params.community,
      });
    },
  });

  if (isError) return "Error";
  // FIXME: Loading screen here
  if (isLoading) return "Loading...";

  return (
    <section className={cn(cardLayout)}>
      <Card>
        <CardHeader>
          <CardTitle>
            <Avatar src="" className="" />
          </CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </section>
  );
}
