// Type definitions for NeuralSense application

export interface User {
  id: string;
  email?: string;
  name?: string;
  isGuest: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Session {
  id: string;
  sessionId?: string; // Backend uses sessionId
  userId?: string;
  startTime: string;
  endTime?: string;
  status: "started" | "analyzing" | "completed" | "failed" | "active";
}

export interface FaceAnalysisResult {
  emotion: string; // AWS emotion: HAPPY, SAD, ANGRY, FEAR, DISGUSTED, CONFUSED, SURPRISED, CALM
  confidence: number;
  emotions?: Record<string, number>; // All detected emotions with scores
  features?: Record<string, number>;
  facialStressScore?: number; // AWS Rekognition stress score
  dominantEmotion?: string; // Same as emotion field
}

export interface VoiceAnalysisResult {
  tone: string;
  confidence: number;
  features?: Record<string, number>;
}

export type StressLevel = "low" | "moderate" | "high";

export interface StressAnalysisResult {
  sessionId: string;
  stressLevel: StressLevel;
  confidence: number;
  faceAnalysis: FaceAnalysisResult;
  voiceAnalysis: VoiceAnalysisResult;
  feedback: string;
  timestamp: string;
}

export interface HistorySession {
  id: string;
  stressLevel: StressLevel;
  confidence: number;
  timestamp: string;
  feedback: string;
}

export interface ConsentState {
  camera: boolean;
  microphone: boolean;
  dataProcessing: boolean;
  timestamp?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
