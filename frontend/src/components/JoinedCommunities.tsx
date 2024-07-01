import { useUserStore } from "@/store/userStore";
import { FaUserGroup as PeopleIcon } from "react-icons/fa6";
import { BiMessageDots as MessageIcon } from "react-icons/bi";
import { Accordion, AccordionItem, Button, button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function JoinedCommunities() {
  const { userData } = useUserStore();
  const router = useRouter();

  return (
    <Accordion variant="light" defaultExpandedKeys={["1"]}>
      <AccordionItem
        key="1"
        aria-label="Joined Communities"
        title={
          <div className="flex items-center gap-2">
            <PeopleIcon className="" />
            Joined Communities
          </div>
        }
      >
        {userData?.communitiesJoined.map((community) => (
          <Button
            key={community}
            variant="flat"
            color="primary"
            className="mb-1 flex w-full items-center justify-normal gap-2 pl-6"
            aria-label={`c/${community}}`}
            onClick={() => router.push(`/c/${community}`)}
          >
            <MessageIcon className="mt-1 text-xl" />
            c/{community}
          </Button>
        ))}
      </AccordionItem>
    </Accordion>
  );
}

export default JoinedCommunities;
