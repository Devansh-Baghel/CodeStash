import { Button } from "@nextui-org/react";
import { VscGitStash as CodeStashIcon } from "react-icons/vsc";

export default function GenericDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="mb-6 flex justify-center items-center">
        <Button
          className="flex gap-2 text-purple-500 px-10 py-5 rounded-[20px]"
          variant="light"
        >
          <CodeStashIcon className="w-8 h-8" />
          <h2 className="text-2xl font-medium mt-1">CodeStash</h2>
        </Button>
      </nav>
      {/* <aside></aside> */}
      {children}
    </>
  );
}
