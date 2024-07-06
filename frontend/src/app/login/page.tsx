import { Metadata } from 'next';

import LoginForm from '@/components/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cardLayout } from '@/utils/classnames';

export const metadata: Metadata = {
  title: "Login - CodeStash",
};

export default function Login() {
  return (
    <main className={cn(cardLayout, `flex items-center justify-center pt-10`)}>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
