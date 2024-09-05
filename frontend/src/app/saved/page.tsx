import SavedPosts from "@/components/SavedPosts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Posts - CodeStash",
};

export default function SavedPostsPage() {
  return <SavedPosts />;
}
