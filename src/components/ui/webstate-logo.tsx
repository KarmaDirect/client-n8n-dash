import { cn } from "@/lib/utils";

interface WebstateLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "white" | "gradient";
}

export function WebstateLogo({ 
  className, 
  size = "md", 
  variant = "default" 
}: WebstateLogoProps) {
  const sizeClasses = {
    sm: "text-lg font-bold",
    md: "text-2xl font-bold",
    lg: "text-4xl font-bold", 
    xl: "text-6xl font-bold"
  };

  const variantClasses = {
    default: "text-slate-900 dark:text-white",
    white: "text-white",
    gradient: "bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
  };

  return (
    <div className={cn("flex items-center font-mono tracking-tight", className)}>
      <span className={cn(sizeClasses[size], variantClasses[variant])}>
        web<span className="text-blue-600">state</span>
      </span>
    </div>
  );
}

