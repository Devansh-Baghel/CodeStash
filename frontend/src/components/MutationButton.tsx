import { Button } from "@nextui-org/react";
import { BiLoaderAlt as Loader } from "react-icons/bi";

export default function MutationButton({
  onClick,
  isPending,
  children,
  type,
  className,
  size,
  radius,
}: {
  type?: "button" | "submit";
  onClick?: () => void;
  isPending: boolean;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  radius?: "sm" | "md" | "lg" | "full" | "none";
}) {
  return (
    <Button
      type={type}
      color={isPending ? "default" : "primary"}
      onClick={onClick}
      disabled={isPending}
      className={className}
      size={size}
      radius={radius}
    >
      {isPending && <Loader className="mr-2 size-4 animate-spin" />}
      {children}
    </Button>
  );
}