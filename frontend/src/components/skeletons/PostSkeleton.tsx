import { cn } from '@/lib/utils';
import { cardLayout } from '@/utils/classnames';
import { Button, Skeleton } from '@nextui-org/react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

export default function PostSkeleton() {
  return (
    <Card className={cn(cardLayout)}>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-10 rounded-2xl" />
          <Skeleton className="mt-3 h-4 w-52 rounded-sm" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-52 rounded-2xl" />
      </CardContent>
      <CardFooter>
        <Button
          variant="flat"
          color="primary"
          radius="full"
          isLoading
          className="w-full text-lg"
        >
          Save post
        </Button>
      </CardFooter>
    </Card>
  );
}
