import { cn } from "../utils/cn";

const buttonVariants = {
  primary: "bg-primary text-white hover:bg-orange-700",
  secondary: "border-primary text-primary hover:bg-slate-50",
  disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
};

export function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  variant: "primary" | "secondary";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out cursor-pointer hover:scale-105",
        disabled ? buttonVariants.disabled : buttonVariants[variant]
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
