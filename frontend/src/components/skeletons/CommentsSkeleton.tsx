import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton, Textarea } from "@heroui/react";

export default function CommentsSkeleton() {
  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>0 Comments</CardTitle>
        <Textarea
          variant="underlined"
          required
          color="primary"
          placeholder="Add a comment"
          className="col-span-12 mb-3 h-10 md:col-span-6"
        />
      </CardHeader>
      {[1, 2, 3, 4].map((_, index) => (
        <CardContent key={index}>
          <Skeleton className="mb-2 h-4 w-52 rounded-2xl" />
          <Skeleton className="h-14 rounded-2xl" />
        </CardContent>
      ))}
    </Card>
  );
}
