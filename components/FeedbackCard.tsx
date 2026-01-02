import React from "react";
import { clsx } from "clsx";
import type { StressLevel } from "@/types";

/**
 * FeedbackCard Component
 * Displays personalized stress feedback with calming design
 */
interface FeedbackCardProps {
  stressLevel: StressLevel;
  feedback: string;
  confidence: number;
  className?: string;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  stressLevel,
  feedback,
  confidence,
  className,
}) => {
  const getTips = (level: StressLevel): string[] => {
    const normalizedLevel = level.toLowerCase() as StressLevel;
    switch (normalizedLevel) {
      case "low":
        return [
          "You're doing great! Keep up the positive habits.",
          "Consider maintaining your current routine.",
          "Stay connected with supportive people.",
        ];
      case "moderate":
        return [
          "Take short breaks throughout your day.",
          "Practice deep breathing or meditation.",
          "Engage in physical activity you enjoy.",
          "Talk to someone you trust about your feelings.",
        ];
      case "high":
        return [
          "Consider speaking with a counselor or mental health professional.",
          "Prioritize rest and self-care activities.",
          "Break tasks into smaller, manageable steps.",
          "Reach out to friends, family, or support services.",
          "Remember: seeking help is a sign of strength.",
        ];
      default:
        return ["Take care of yourself and monitor your stress levels."];
    }
  };

  const tips = getTips(stressLevel);

  return (
    <div
      className={clsx(
        "rounded-2xl border-2 p-6 bg-white shadow-lg",
        stressLevel === "low" && "border-stress-low",
        stressLevel === "moderate" && "border-stress-moderate",
        stressLevel === "high" && "border-stress-high",
        className
      )}
    >
      {/* Main Feedback */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-calm-900 mb-3">
          Your Stress Insight
        </h3>
        <p className="text-calm-700 leading-relaxed">{feedback}</p>
      </div>

      {/* Confidence Indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-calm-600">
            Confidence Level
          </span>
          <span className="text-sm font-bold text-calm-800">
            {Math.round(confidence * 100)}%
          </span>
        </div>
        <div className="w-full bg-calm-100 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${confidence * 100}%` }}
            role="progressbar"
            aria-valuenow={confidence * 100}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Helpful Tips */}
      <div>
        <h4 className="text-lg font-semibold text-calm-900 mb-3">
          Supportive Suggestions
        </h4>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-calm-700 text-sm"
            >
              <span className="text-primary-500 mt-1">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-calm-50 rounded-lg border border-calm-200">
        <p className="text-xs text-calm-600 italic">
          <strong>Note:</strong> NeuralSense provides supportive insights and
          does not replace professional evaluation. If you're experiencing
          persistent stress, please consult with a qualified mental health
          professional.
        </p>
      </div>
    </div>
  );
};

export default FeedbackCard;
