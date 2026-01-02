import React from "react";
import { clsx } from "clsx";

/**
 * Loader Component
 * Displays loading spinner with optional message
 */
interface LoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  message = "Loading...",
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      <div
        className={clsx(
          "animate-spin rounded-full border-primary-500 border-t-transparent",
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-calm-600 text-sm font-medium">{message}</p>
      )}
    </div>
  );
};

export default Loader;
