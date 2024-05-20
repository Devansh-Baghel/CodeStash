import Posts from "@/components/Posts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - CodeStash",
};

export default function Home() {
  return <Posts />;
}
