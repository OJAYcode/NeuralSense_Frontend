/**
 * Utility functions for NeuralSense application
 */

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Check if browser supports required APIs
 */
export function checkBrowserSupport(): {
  camera: boolean;
  microphone: boolean;
  mediaRecorder: boolean;
} {
  return {
    camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    microphone: !!(
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    ),
    mediaRecorder: typeof MediaRecorder !== "undefined",
  };
}

/**
 * Get stress level color
 */
export function getStressColor(level: "low" | "moderate" | "high"): string {
  switch (level) {
    case "low":
      return "#86efac";
    case "moderate":
      return "#fbbf24";
    case "high":
      return "#f87171";
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Sleep/delay utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
