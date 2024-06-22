"use client";

import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import Navbar from "./NavBar";
import SideBar from "./SideBar";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const { getCurrentUser } = useUserStore();

  // TODO: add Loading user data... screen like monkeytype
  // FIXME: only run this if accessToken and refreshToken exist
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <>
      <Navbar />
      <div className="flex">
        <SideBar />
        {children}
      </div>
    </>
  );
}
