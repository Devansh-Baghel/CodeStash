import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";
import { cardLayout } from "@/utils/classnames";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sign up - CodeStash",
};

export default function Register() {
  return (
    <main className={cn(cardLayout, "flex items-center justify-center pt-10")}>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </main>
  );
}
