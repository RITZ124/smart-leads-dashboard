import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };

const Spinner = ({ size = "md", className = "" }: SpinnerProps) => (
  <Loader2
    className={`animate-spin text-brand-500 ${sizeMap[size]} ${className}`}
  />
);

export const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <Spinner size="lg" />
  </div>
);

export default Spinner;
