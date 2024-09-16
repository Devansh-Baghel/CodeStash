import { Button } from "@nextui-org/react";
import { BiLoaderAlt as Loader } from "react-icons/bi";

export default function MutationButton({
  onClick,
  isPending,
  children,
  type,
  className,
}: {
  type?: "button" | "submit";
  onClick?: () => Promise<void>;
  isPending: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      type={type}
      color={isPending ? "default" : "primary"}
      onClick={onClick}
      disabled={isPending}
      className={className}
    >
      {isPending && <Loader className="mr-2 size-4 animate-spin" />}
      {children}
    </Button>
  );
}
