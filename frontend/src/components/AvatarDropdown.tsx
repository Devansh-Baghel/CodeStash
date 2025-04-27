import { useUserStore } from "@/store/userStore";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@heroui/react";
import Link from "next/link";

export default function AvatarDropdown() {
  const { userData, logoutUser, showProfileCard, setShowProfileCard } =
    useUserStore();

  function switchProfileCardStatus() {
    setShowProfileCard(!showProfileCard);
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: userData?.avatar,
          }}
          className="mr-10 transition-transform"
          description={`@${userData?.username}`}
          name={`${userData?.firstName} ${userData?.lastName}`}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem
          key="profile"
          className="h-14 gap-2"
          as={Link}
          href="/profile"
        >
          <p className="font-bold">Signed in as</p>
          <p className="font-bold">@{userData?.username}</p>
        </DropdownItem>
        <DropdownItem key="settings" as={Link} href="/settings">
          My Settings
        </DropdownItem>
        <DropdownItem key="saved" as={Link} href="/saved">
          Saved Posts
        </DropdownItem>
        <DropdownItem key="profile-card" onClick={switchProfileCardStatus}>
          {showProfileCard ? "Hide Profile Card" : "Show Profile Card"}
        </DropdownItem>
        {/* <DropdownItem key="configurations">Configurations</DropdownItem> */}
        {/* <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
        <DropdownItem key="logout" color="danger" onClick={logoutUser}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
