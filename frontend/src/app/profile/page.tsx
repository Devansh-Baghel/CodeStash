"use client";

import NotLoggedIn from "@/components/NotLoggedIn";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { cardLayout } from "@/utils/classnames";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import UserPosts from "@/components/UserPosts";
import UploadAvatar from "@/components/UploadAvatar";
import Link from "next/link";
import SavedPosts from "@/components/SavedPosts";
import UpvotedPosts from "@/components/UpvotedPosts";
import DownvotedPosts from "@/components/DownvotedPosts";
import useTitle from "@/hooks/useTitle";

// TODO: This page should show the user's personal details, saved posts, etc (i.e. everything that is publically visible + everything that is NOT publically visible)
export default function Profile() {
  useTitle("Profile");

  const { isLoggedIn, userData } = useUserStore();

  if (!isLoggedIn) {
    return (
      <NotLoggedIn
        title="Your Profile"
        description="Login or sign up to view your profile"
      />
    );
  }

  return (
    <section className={cn(cardLayout)}>
      <h1 className="mb-4 text-2xl font-bold text-gray-600">Your Profile</h1>
      <Card className="mx-auto mb-8">
        <CardContent className="flex gap-10 p-10">
          <Link target="_blank" href={userData?.avatar!}>
            <Avatar src={userData?.avatar} size="lg" className="h-32 w-32" />
          </Link>
          <div>
            <h2 className="text-grey-900 text-2xl font-medium">
              {userData?.firstName} {userData?.lastName}
            </h2>
            <CardDescription className="mb-2">
              u/{userData?.username}
            </CardDescription>
            {/* TODO: replace these three lines with something better */}
            <h3>Saved Posts: {userData?.savedPosts.length}</h3>
            <h3>Upvoted Posts: {userData?.upvotedPosts.length}</h3>
            <h3>Downvoted Posts: {userData?.downvotedPosts.length}</h3>
          </div>
        </CardContent>
        <CardFooter className="px-10">
          <UploadAvatar
            buttonText={userData?.avatar ? "Update Avatar" : "Upload Avatar"}
            type="user"
          />
        </CardFooter>
      </Card>
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          size="lg"
          variant="underlined"
          color="primary"
        >
          <Tab key="your-posts" title="Your Posts">
            <UserPosts />
          </Tab>
          <Tab key="saved" title="Saved Posts">
            <SavedPosts hasTitle={false} />
          </Tab>
          <Tab key="upvoted" title="Upvoted Posts">
            <UpvotedPosts hasTitle={false} />
          </Tab>
          <Tab key="downvoted" title="Downvoted Posts">
            <DownvotedPosts hasTitle={false} />
          </Tab>
        </Tabs>
      </div>
    </section>
  );
}
