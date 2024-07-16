"use client";

import { useEffect } from "react";

import { useUserStore } from "@/store/userStore";

import Navbar from "./NavBar";
import ProfileCard from "./ProfileCard";
import SideBar from "./SideBar";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const { getCurrentUser, isLoggedIn } = useUserStore();

  // TODO: add Loading user data... screen like monkeytype
  // FIXME: only run this if accessToken and refreshToken exist
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <div className="mx-auto max-w-[1400px]">
      <Navbar />
      <div className="flex">
        <SideBar />
        {children}
        {/* TODO: add some other card here when user isn't logged in */}
        {/* Maybe make the avatar of the profile card to be this image https://i.seadn.io/gcs/files/ccb8c81826526eb68f002bd3fabaa05c.png?auto=format&dpr=1&w=1000 */}
        {isLoggedIn && <ProfileCard />}
      </div>
    </div>
  );
}
