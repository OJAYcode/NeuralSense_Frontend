import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  Session,
  FaceAnalysisResult,
  VoiceAnalysisResult,
  StressAnalysisResult,
  ConsentState,
  StressLevel,
  HistorySession,
} from "@/types";
import { apiClient } from "./api";

/**
 * Authentication Store
 * Manages user authentication state and token
 */
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setGuest: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        apiClient.setToken(token);
        set({ user, token, isAuthenticated: true });
      },

      clearAuth: () => {
        apiClient.setToken(null);
        set({ user: null, token: null, isAuthenticated: false });
      },

      setGuest: () => {
        const guestUser: User = {
          id: `guest_${Date.now()}`,
          isGuest: true,
        };
        set({ user: guestUser, isAuthenticated: true, token: null });
      },
    }),
    {
      name: "neuralsense-auth",
    }
  )
);

/**
 * Consent Store
 * Manages user consent for camera, microphone, and data processing
 */
interface ConsentStore {
  consent: ConsentState;
  hasGivenConsent: boolean;
  giveConsent: (
    camera: boolean,
    microphone: boolean,
    dataProcessing: boolean
  ) => void;
  revokeConsent: () => void;
}

export const useConsentStore = create<ConsentStore>()(
  persist(
    (set) => ({
      consent: {
        camera: false,
        microphone: false,
        dataProcessing: false,
      },
      hasGivenConsent: false,

      giveConsent: (camera, microphone, dataProcessing) => {
        set({
          consent: {
            camera,
            microphone,
            dataProcessing,
            timestamp: new Date().toISOString(),
          },
          hasGivenConsent: camera && microphone && dataProcessing,
        });
      },

      revokeConsent: () => {
        set({
          consent: {
            camera: false,
            microphone: false,
            dataProcessing: false,
          },
          hasGivenConsent: false,
        });
      },
    }),
    {
      name: "neuralsense-consent",
    }
  )
);

/**
 * Session Store
 * Manages current stress detection session state
 */
interface SessionStore {
  currentSession: Session | null;
  faceAnalysis: FaceAnalysisResult | null;
  voiceAnalysis: VoiceAnalysisResult | null;
  finalResult: StressAnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;

  // Actions
  startSession: () => Promise<Session>;
  setFaceAnalysis: (result: FaceAnalysisResult) => void;
  setVoiceAnalysis: (result: VoiceAnalysisResult) => void;
  setFinalResult: (result: StressAnalysisResult) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  setError: (error: string | null) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  currentSession: null,
  faceAnalysis: null,
  voiceAnalysis: null,
  finalResult: null,
  isAnalyzing: false,
  error: null,

  startSession: async () => {
    try {
      set({ isAnalyzing: true, error: null });
      const session = await apiClient.startSession();
      set({ currentSession: session, isAnalyzing: false });
      return session; // Return the session
    } catch (error: any) {
      set({
        error: error.message || "Failed to start session",
        isAnalyzing: false,
      });
      throw error;
    }
  },

  setFaceAnalysis: (result) => set({ faceAnalysis: result }),
  setVoiceAnalysis: (result) => set({ voiceAnalysis: result }),
  setFinalResult: (result) => set({ finalResult: result }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setError: (error) => set({ error }),

  resetSession: () =>
    set({
      currentSession: null,
      faceAnalysis: null,
      voiceAnalysis: null,
      finalResult: null,
      isAnalyzing: false,
      error: null,
    }),
}));

/**
 * History Store
 * Manages stress session history
 */
interface HistoryStore {
  sessions: HistorySession[];
  isLoading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  sessions: [],
  isLoading: false,
  error: null,

  fetchHistory: async () => {
    try {
      set({ isLoading: true, error: null });
      const history = await apiClient.getHistory();
      set({ sessions: history, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch history",
        isLoading: false,
      });
    }
  },
}));
