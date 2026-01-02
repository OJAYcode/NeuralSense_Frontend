import React from "react";
import { clsx } from "clsx";
import type { StressLevel } from "@/types";

/**
 * StressBadge Component
 * Displays color-coded stress level indicator
 */
interface StressBadgeProps {
  level: StressLevel;
  confidence?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const StressBadge: React.FC<StressBadgeProps> = ({
  level,
  confidence,
  size = "md",
  showLabel = true,
  className,
}) => {
  const getStressConfig = (level: StressLevel) => {
    const normalizedLevel = level.toLowerCase() as StressLevel;
    switch (normalizedLevel) {
      case "low":
        return {
          color: "bg-stress-low text-green-900",
          label: "Low Stress",
          icon: "😌",
        };
      case "moderate":
        return {
          color: "bg-stress-moderate text-amber-900",
          label: "Moderate Stress",
          icon: "😐",
        };
      case "high":
        return {
          color: "bg-stress-high text-red-900",
          label: "High Stress",
          icon: "😟",
        };
      default:
        return {
          color: "bg-gray-200 text-gray-900",
          label: "Unknown",
          icon: "❓",
        };
    }
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const config = getStressConfig(level);

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 rounded-full font-semibold",
        config.color,
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={`Stress level: ${config.label}`}
    >
      <span className="text-lg" role="img" aria-label={config.label}>
        {config.icon}
      </span>
      {showLabel && <span className="font-bold">{config.label}</span>}
      {confidence !== undefined && (
        <span className="text-xs opacity-80">
          ({Math.round(confidence * 100)}%)
        </span>
      )}
    </div>
  );
};

export default StressBadge;
