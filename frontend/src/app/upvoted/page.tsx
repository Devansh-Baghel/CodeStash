import UpvotedPosts from "@/components/UpvotedPosts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upvoted Posts - CodeStash",
};

export default function UpvotedPostsPage() {
  return <UpvotedPosts />;
}
