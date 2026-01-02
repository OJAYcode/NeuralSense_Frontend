/**
 * Emotion mapping and utilities for AWS Rekognition emotions
 */

export type AWSEmotion =
  | "HAPPY"
  | "SAD"
  | "ANGRY"
  | "FEAR"
  | "DISGUSTED"
  | "CONFUSED"
  | "SURPRISED"
  | "CALM";

/**
 * Map emotion to display-friendly text
 */
export function getEmotionDisplayName(emotion: string): string {
  const normalized = emotion.toUpperCase();

  const displayNames: Record<string, string> = {
    HAPPY: "Happy",
    SAD: "Sad",
    ANGRY: "Angry",
    FEAR: "Fearful",
    DISGUSTED: "Disgusted",
    CONFUSED: "Confused",
    SURPRISED: "Surprised",
    CALM: "Calm",
    // Legacy Azure mappings (for backwards compatibility)
    HAPPINESS: "Happy",
    SADNESS: "Sad",
    ANGER: "Angry",
    DISGUST: "Disgusted",
    SURPRISE: "Surprised",
    NEUTRAL: "Calm",
    CONTEMPT: "Calm",
  };

  return displayNames[normalized] || emotion;
}

/**
 * Map emotion to emoji icon
 */
export function getEmotionEmoji(emotion: string): string {
  const normalized = emotion.toUpperCase();

  const emojis: Record<string, string> = {
    HAPPY: "😊",
    SAD: "😢",
    ANGRY: "😠",
    FEAR: "😨",
    DISGUSTED: "🤢",
    CONFUSED: "😕",
    SURPRISED: "😲",
    CALM: "😌",
    // Legacy Azure mappings
    HAPPINESS: "😊",
    SADNESS: "😢",
    ANGER: "😠",
    DISGUST: "🤢",
    SURPRISE: "😲",
    NEUTRAL: "😌",
    CONTEMPT: "😌",
  };

  return emojis[normalized] || "😐";
}

/**
 * Get emotion color for UI styling
 */
export function getEmotionColor(emotion: string): string {
  const normalized = emotion.toUpperCase();

  const colors: Record<string, string> = {
    HAPPY: "text-green-600",
    SAD: "text-blue-600",
    ANGRY: "text-red-600",
    FEAR: "text-purple-600",
    DISGUSTED: "text-orange-600",
    CONFUSED: "text-yellow-600",
    SURPRISED: "text-pink-600",
    CALM: "text-calm-600",
    // Legacy mappings
    HAPPINESS: "text-green-600",
    SADNESS: "text-blue-600",
    ANGER: "text-red-600",
    DISGUST: "text-orange-600",
    SURPRISE: "text-pink-600",
    NEUTRAL: "text-calm-600",
    CONTEMPT: "text-calm-600",
  };

  return colors[normalized] || "text-calm-600";
}

/**
 * Get emotion background color for UI styling
 */
export function getEmotionBgColor(emotion: string): string {
  const normalized = emotion.toUpperCase();

  const colors: Record<string, string> = {
    HAPPY: "bg-green-50",
    SAD: "bg-blue-50",
    ANGRY: "bg-red-50",
    FEAR: "bg-purple-50",
    DISGUSTED: "bg-orange-50",
    CONFUSED: "bg-yellow-50",
    SURPRISED: "bg-pink-50",
    CALM: "bg-calm-50",
    // Legacy mappings
    HAPPINESS: "bg-green-50",
    SADNESS: "bg-blue-50",
    ANGER: "bg-red-50",
    DISGUST: "bg-orange-50",
    SURPRISE: "bg-pink-50",
    NEUTRAL: "bg-calm-50",
    CONTEMPT: "bg-calm-50",
  };

  return colors[normalized] || "bg-calm-50";
}
