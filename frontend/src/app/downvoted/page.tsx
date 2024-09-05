import DownvotedPosts from "@/components/DownvotedPosts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Downvoted Posts - CodeStash",
};

// have to do this because of https://stackoverflow.com/questions/76404674/type-error-page-has-an-invalid-default-export-type-is-not-valid
export default function DownvotedPostsPage() {
  return <DownvotedPosts />;
}
