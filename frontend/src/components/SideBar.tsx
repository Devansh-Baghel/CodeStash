import { useUserStore } from "@/store/userStore";
import { Listbox, ListboxItem } from "@nextui-org/listbox";

export default function SideBar() {
  const { isLoggedIn } = useUserStore();

  return (
    <aside className="hidden min-w-80 py-10 pl-4 pr-20 md:block">
      {/* TODO: Make the reddit like sidebar */}
      {!isLoggedIn ? (
        // Link of items and pages
        // Home
        // Popular langugages
        // Communities
        // Popular communities
        // FAQ page
        // Settings page
        // Profile
        <Listbox aria-label="Actions" onAction={(key) => alert(key)}>
          <ListboxItem key="new">New file</ListboxItem>
          <ListboxItem key="copy">Copy link</ListboxItem>
          <ListboxItem key="edit">Edit file</ListboxItem>
          <ListboxItem key="delete" className="text-danger" color="danger">
            Delete file
          </ListboxItem>
        </Listbox>
      ) : (
        <div>
          <h1>This is aside</h1>
        </div>
      )}
    </aside>
  );
}
