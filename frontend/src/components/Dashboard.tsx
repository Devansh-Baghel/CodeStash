"use client";

import { useUserStore } from "@/store/userStore";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useState } from "react";
import Navbar from "./NavBar";
import ProfileCard from "./ProfileCard";
import SideBar from "./SideBar";
import FullPagePreLoader from "./animations/FullPagePreLoader";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const { getCurrentUser, isLoggedIn, showProfileCard } = useUserStore();
  const [parent] = useAutoAnimate();
  const [loading, setLoading] = useState(true);

  // TODO: add Loading user data... screen like monkeytype
  // FIXME: only run this if accessToken and refreshToken exist
  useEffect(() => {
    getCurrentUser().finally(() => setLoading(false));
  }, [getCurrentUser]);

  if (loading) return <FullPagePreLoader />;

  return (
    <div className="mx-auto max-w-[1400px]">
      <Navbar />
      <div className="flex" ref={parent}>
        <SideBar />
        {children}
        {isLoggedIn && showProfileCard && <ProfileCard />}
      </div>
    </div>
  );
}
