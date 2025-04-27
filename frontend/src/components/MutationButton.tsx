import { Button } from "@heroui/react";
import { BiLoaderAlt as Loader } from "react-icons/bi";

export default function MutationButton({
  onClick,
  isPending,
  children,
  type,
  className,
  size,
  radius,
  id,
}: {
  type?: "button" | "submit";
  onClick?: () => void;
  isPending: boolean;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  radius?: "sm" | "md" | "lg" | "full" | "none";
  id?: string;
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
      id={id}
    >
      {isPending && <Loader className="mr-2 size-4 animate-spin" />}
      {children}
    </Button>
  );
}
