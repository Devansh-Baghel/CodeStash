import { Metadata } from "next";

import Posts from "@/components/Posts";

export const metadata: Metadata = {
  title: "Home - CodeStash",
};

export default function Home() {
  return <Posts />;
}
