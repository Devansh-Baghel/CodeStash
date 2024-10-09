import { Progress } from "@nextui-org/react";
import { VscGitStash as CodeStashIcon } from "react-icons/vsc";

export default function FullPagePreLoader() {
  return (
    <div className="flex h-[85vh] items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center gap-2">
        <h1 className="text-5xl font-bold text-primary flex items-end gap-4">
          <CodeStashIcon className="h-16 w-16" />
          CodeStash
        </h1>
        <Progress size="md" isIndeterminate aria-label="Loading..." />
      </div>
    </div>
  );
}
