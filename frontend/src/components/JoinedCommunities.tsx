import { useRouter } from "next/navigation";
import { BiMessageDots as MessageIcon } from "react-icons/bi";
import { FaUserGroup as PeopleIcon } from "react-icons/fa6";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserStore } from "@/store/userStore";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import Link from "next/link";

function JoinedCommunities() {
  const { userData } = useUserStore();
  const router = useRouter();

  return (
    <Accordion variant="light" defaultExpandedKeys={["1"]}>
      <AccordionItem
        key="1"
        aria-label="Joined Communities"
        className="mt-[-10px] pb-0"
        title={
          <div className="flex items-center gap-2 text-[16px]">
            <PeopleIcon className="" />
            Joined Communities
          </div>
        }
      >
        <ScrollArea className="mt-[-8px] h-56 w-full">
          {userData?.communitiesJoined.map((community) => (
            <Button
              key={community}
              variant="flat"
              color="primary"
              className="mb-1 flex h-8 w-60 items-center justify-normal gap-2 pl-6 text-sm"
              aria-label={`c/${community}}`}
              as={Link}
              href={`/c/${community}`}
            >
              <MessageIcon className="mt-1" />
              c/{community}
            </Button>
          ))}
        </ScrollArea>
      </AccordionItem>
    </Accordion>
  );
}

export default JoinedCommunities;
