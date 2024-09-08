import { Button, Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { IoMdSearch as SearchIcon } from "react-icons/io";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [parent] = useAutoAnimate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <form
      className="mx-20 flex w-full max-w-[700px] items-center gap-4"
      ref={parent}
      onSubmit={handleSubmit}
    >
      <Input
        isClearable
        radius="lg"
        size="md"
        placeholder="Search through code snippets..."
        onChange={(event) => setSearchTerm(event.target.value)}
        classNames={{
          input: [
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ],
          inputWrapper: [
            "shadow-md",
            "bg-white",
            "dark:bg-default/60",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-default-200/70",
            "dark:hover:bg-default/70",
            "group-data-[focus=true]:bg-default-200/50",
            "dark:group-data-[focus=true]:bg-default/60",
            "!cursor-text",
          ],
        }}
        startContent={
          <SearchIcon className="pointer-events-none mb-0.5 size-5 flex-shrink-0 text-black/50 text-slate-400 dark:text-white/90" />
        }
      />

      {searchTerm && (
        <Button type="submit" color="success" radius="full">
          <SearchIcon className="size-10" />
          Search
        </Button>
      )}
    </form>
  );
}
