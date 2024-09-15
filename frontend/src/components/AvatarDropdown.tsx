import { useUserStore } from "@/store/userStore";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
} from "@nextui-org/react";

export default function AvatarDropdown() {
  const { userData } = useUserStore();

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
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-bold">Signed in as</p>
          <p className="font-bold">@{userData?.username}</p>
        </DropdownItem>
        <DropdownItem key="settings">My Settings</DropdownItem>
        <DropdownItem key="team_settings">Team Settings</DropdownItem>
        <DropdownItem key="analytics">Analytics</DropdownItem>
        <DropdownItem key="system">System</DropdownItem>
        <DropdownItem key="configurations">Configurations</DropdownItem>
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        <DropdownItem key="logout" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
