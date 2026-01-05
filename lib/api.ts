import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  Session,
  StressAnalysisResult,
  HistorySession,
  ApiError,
} from "@/types";

/**
 * Axios API client for NeuralSense backend
 * Handles authentication, error handling, and retry logic
 */
class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
      timeout: 30000, // 30 seconds
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor - inject auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // If sending FormData, remove the default Content-Type to let browser set it
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
          console.log("FormData detected - Content-Type removed");
          console.log("Request headers:", config.headers);
          console.log("Request URL:", config.url);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Load token from localStorage on client side
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("neuralsense_token");
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("neuralsense_token", token);
      } else {
        localStorage.removeItem("neuralsense_token");
      }
    }
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Handle API errors with user-friendly messages
   */
  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;

      console.error("API Error Response:", {
        status,
        statusText: error.response.statusText,
        data,
        headers: error.response.headers,
      });

      return {
        message:
          data?.message || data?.error || this.getDefaultErrorMessage(status),
        code: data?.code || `HTTP_${status}`,
        details: data,
      };
    } else if (error.request) {
      // Request made but no response
      console.error("Network error - no response from server:", error.request);
      return {
        message:
          `Cannot connect to backend server at ${this.client.defaults.baseURL}. Please ensure the backend is running.`,
        code: "NETWORK_ERROR",
      };
    } else {
      // Error setting up request
      return {
        message: error.message || "An unexpected error occurred.",
        code: "UNKNOWN_ERROR",
      };
    }
  }

  /**
   * Get default error message based on status code
   */
  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Authentication required. Please log in.";
      case 403:
        return "Access denied.";
      case 404:
        return "Resource not found.";
      case 500:
        return "Server error. Please try again later.";
      case 503:
        return "Service temporarily unavailable.";
      default:
        return "An error occurred. Please try again.";
    }
  }

  /**
   * Retry a request with exponential backoff
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i))
        );
      }
    }
    throw new Error("Max retries reached");
  }

  // ==================== AUTH ENDPOINTS ====================

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>(
      "/auth/register",
      data
    );
    return response.data;
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  }

  /**
   * Continue as guest (no authentication required)
   */
  async continueAsGuest(): Promise<{ sessionToken: string }> {
    const response = await this.client.post("/auth/guest");
    return response.data;
  }

  // ==================== SESSION ENDPOINTS ====================

  /**
   * Start a new stress detection session
   */
  async startSession(): Promise<Session> {
    const response = await this.client.post<any>("/session/start");

    // Backend returns {session: {...}} not the session directly
    const sessionData = response.data.session || response.data;

    // Map sessionId to id for consistency
    return {
      id: sessionData.sessionId || sessionData.id,
      userId: sessionData.userId,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      status: sessionData.status,
    };
  }

  /**
   * Get session history
   */
  async getHistory(): Promise<HistorySession[]> {
    const response = await this.client.get<HistorySession[]>(
      "/session/history"
    );
    return response.data;
  }

  // ==================== ANALYSIS ENDPOINTS ====================

  /**
   * Analyze facial expression from image using AWS Rekognition
   */
  async analyzeFace(sessionId: string, imageBlob: Blob): Promise<number> {
    // Convert blob to base64 string
    const base64Image = await this.blobToBase64(imageBlob);

    // Send as JSON with base64 image
    const response = await this.retryRequest(
      () =>
        this.client.post("/analyze/face", {
          sessionId,
          image: base64Image,
        }),
      2 // Retry twice for face analysis
    );

    // Return the facial stress score from response
    return response.data.facialStressScore || response.data.stressScore || 0;
  }

  /**
   * Convert Blob to base64 string
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Analyze voice from audio recording
   */
  async analyzeVoice(sessionId: string, audioBlob: Blob): Promise<number> {
    // Backend uses multer.single("audio"), so we need to send as FormData
    console.log("=== Voice Analysis Request ===");
    console.log("SessionId:", sessionId);
    console.log("Audio Blob:", {
      size: audioBlob.size,
      type: audioBlob.type,
      isBlob: audioBlob instanceof Blob,
    });
    console.log("Current token:", this.token ? "Present" : "Missing");

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm"); // Use .webm since type is audio/webm
    formData.append("sessionId", sessionId);

    // Log FormData contents
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }

    console.log("Sending FormData to /analyze/voice...");

    // Don't set Content-Type header - let browser set it with boundary
    // This ensures Authorization header from interceptor is preserved
    // Voice analysis takes longer, so increase timeout to 2 minutes
    const response = await this.retryRequest(
      () =>
        this.client.post("/analyze/voice", formData, {
          timeout: 120000, // 2 minutes for voice processing
        }),
      1 // Only retry once for voice analysis due to long processing time
    );

    console.log("Voice analysis completed successfully:", response);

    // Return the voice stress score from response
    return response.data.voiceStressScore || response.data.stressScore || 0;
  }

  /**
   * Get final stress analysis for session
   */
  async getStressAnalysis(
    sessionId: string,
    facialStressScore: number,
    voiceStressScore: number
  ): Promise<StressAnalysisResult> {
    console.log("=== Stress Analysis Fusion Request ===");
    console.log("SessionId:", sessionId);
    console.log(
      "Facial Stress Score:",
      facialStressScore,
      typeof facialStressScore
    );
    console.log(
      "Voice Stress Score:",
      voiceStressScore,
      typeof voiceStressScore
    );

    const payload = {
      sessionId,
      facialStressScore,
      voiceStressScore,
    };

    console.log("Request payload:", JSON.stringify(payload, null, 2));

    const response = await this.retryRequest(
      () => this.client.post<StressAnalysisResult>("/analyze/session", payload),
      3 // Retry up to 3 times for final analysis
    );
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
