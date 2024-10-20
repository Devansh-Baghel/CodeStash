"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/userStore";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, loginUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    loginUser({ email, password });
  }

  return (
    <form onSubmit={(e) => submitForm(e)}>
      <div className="grid gap-4">
        <Button
          variant="default"
          className="w-full"
          type="button"
          onClick={() =>
            loginUser({ email: "test@test.com", password: process.env.NEXT_PUBLIC_DEMO_PASS! })
          }
        >
          Login as a Demo User
        </Button>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* TODO: add this back when we have a password reset feature */}
            {/* <Link href="#" className="ml-auto inline-block text-sm underline">
              Forgot your password?
            </Link> */}
          </div>
          <Input
            id="password"
            type="password"
            required
            // minLength={6}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        {/* TODO: add login with google */}
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline">
          Sign up
        </Link>
      </div>
    </form>
  );
}
