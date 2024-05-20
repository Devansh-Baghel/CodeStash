import { Button } from "@nextui-org/react";
import { VscGitStash as CodeStashIcon } from "react-icons/vsc";
import Hamburger from "./Hamburger";

export default function GenericDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="mb-6 flex justify-between items-center gap-2">
        <Button
          className="flex gap-2 text-primary font-bold"
          radius="full"
          variant="light"
        >
          <CodeStashIcon className="w-8 h-8" />
          <h2 className="text-xl font-semibold mt-1">CodeStash</h2>
        </Button>
        <Hamburger />
      </nav>
      {/* <aside></aside> */}
      {children}
    </>
  );
}
