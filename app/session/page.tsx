"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSessionStore, useConsentStore, useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import CameraCapture from "@/components/CameraCapture";
import AudioRecorder from "@/components/AudioRecorder";
import Loader from "@/components/Loader";

type Step = "start" | "face" | "voice" | "analyzing";

export default function SessionPage() {
  const router = useRouter();
  const { hasGivenConsent } = useConsentStore();
  const { isAuthenticated } = useAuthStore();
  const { currentSession, isAnalyzing, error, startSession, resetSession } =
    useSessionStore();

  const [currentStep, setCurrentStep] = useState<Step>("start");
  const [localSession, setLocalSession] = useState<any>(null); // Store session locally
  const [faceBlob, setFaceBlob] = useState<Blob | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [facialStressScore, setFacialStressScore] = useState<number>(0);
  const [voiceStressScore, setVoiceStressScore] = useState<number>(0);

  // Check consent
  useEffect(() => {
    if (!hasGivenConsent) {
      router.push("/consent");
    }
  }, [hasGivenConsent, router]);

  // Initialize session
  const handleStartSession = async () => {
    try {
      setStepError(null);
      const session = await startSession();
      setLocalSession(session);
      setCurrentStep("face");
    } catch (err: any) {
      setStepError(err.message || "Failed to start session");
    }
  };

  // Handle face capture
  const handleFaceCapture = async (imageBlob: Blob) => {
    const session = localSession || currentSession;

    if (!session) {
      setStepError("Session not initialized. Please restart.");
      return;
    }

    try {
      setStepError(null);
      setFaceBlob(imageBlob);

      // Upload face image for AWS Rekognition analysis
      const sessionId = session.sessionId || session.id;
      console.log("Analyzing face with sessionId:", sessionId);
      const faceScore = await apiClient.analyzeFace(sessionId, imageBlob);

      // Store the facial stress score
      setFacialStressScore(faceScore);
      console.log("Facial stress score:", faceScore);

      // Move to voice step
      setCurrentStep("voice");
    } catch (err: any) {
      setStepError(err.message || "Failed to analyze face. Please try again.");
    }
  };

  // Handle voice recording complete
  const handleVoiceComplete = async (audioBlob: Blob) => {
    const session = localSession || currentSession;

    if (!session) return;

    try {
      setStepError(null);
      setVoiceBlob(audioBlob);
      setCurrentStep("analyzing");

      // Upload voice recording
      const sessionId = session.sessionId || session.id;
      console.log("Analyzing voice with sessionId:", sessionId);
      console.log("Audio blob size:", audioBlob.size, "type:", audioBlob.type);

      const voiceScore = await apiClient.analyzeVoice(sessionId, audioBlob);

      // Store the voice stress score
      setVoiceStressScore(voiceScore);
      console.log("Voice stress score:", voiceScore);

      // Get final analysis with both stress scores
      console.log("Getting final analysis with scores:", {
        facial: facialStressScore,
        voice: voiceScore,
        facialIsZero: facialStressScore === 0,
        voiceIsZero: voiceScore === 0,
      });

      if (facialStressScore === 0 || voiceScore === 0) {
        console.error("ERROR: One or both stress scores are 0!", {
          facialStressScore,
          voiceScore,
        });
      }

      const result = await apiClient.getStressAnalysis(
        sessionId,
        facialStressScore,
        voiceScore
      );

      // Navigate to results with stress scores in URL
      router.push(
        `/results?sessionId=${sessionId}&facialScore=${facialStressScore}&voiceScore=${voiceScore}`
      );
    } catch (err: any) {
      setStepError(err.message || "Failed to analyze voice. Please try again.");
      setCurrentStep("voice"); // Allow retry
    }
  };

  // Handle errors from components
  const handleError = (errorMessage: string) => {
    setStepError(errorMessage);
  };

  // Reset and start new session
  const handleRestart = () => {
    resetSession();
    setLocalSession(null);
    setFaceBlob(null);
    setVoiceBlob(null);
    setStepError(null);
    setCurrentStep("start");
  };

  if (!hasGivenConsent) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-50 via-white to-primary-50">
      {/* Header */}
      <nav className="container mx-auto px-6 py-6 border-b border-calm-200">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🧠</span>
            <span className="text-2xl font-bold text-calm-900">
              NeuralSense
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Link
                href="/history"
                className="px-4 py-2 text-calm-600 font-medium hover:text-calm-800"
              >
                History
              </Link>
            )}
            <button
              onClick={handleRestart}
              className="px-4 py-2 text-calm-600 font-medium hover:text-calm-800"
            >
              New Session
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between items-center">
              {["Start", "Face", "Voice", "Results"].map((label, index) => {
                const stepNames: Step[] = [
                  "start",
                  "face",
                  "voice",
                  "analyzing",
                ];
                const isActive = currentStep === stepNames[index];
                const isPast = stepNames.indexOf(currentStep) > index;

                return (
                  <div key={label} className="flex-1">
                    <div className="flex items-center">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-semibold
                          ${isPast ? "bg-green-500 text-white" : ""}
                          ${isActive ? "bg-primary-500 text-white" : ""}
                          ${
                            !isActive && !isPast
                              ? "bg-calm-200 text-calm-600"
                              : ""
                          }
                        `}
                      >
                        {isPast ? "✓" : index + 1}
                      </div>
                      {index < 3 && (
                        <div
                          className={`flex-1 h-1 mx-2 ${
                            isPast ? "bg-green-500" : "bg-calm-200"
                          }`}
                        />
                      )}
                    </div>
                    <p className="text-xs text-calm-600 mt-2 text-center">
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Display */}
          {(stepError || error) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{stepError || error}</p>
            </div>
          )}

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Step 1: Start Session */}
            {currentStep === "start" && (
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-3xl font-bold text-calm-900">
                  Ready to Check Your Stress Level?
                </h2>
                <p className="text-calm-600 max-w-2xl mx-auto">
                  This will take about 2 minutes. We'll capture a photo of your
                  face and a short voice recording to analyze your stress
                  indicators.
                </p>

                <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg max-w-2xl mx-auto">
                  <p className="text-sm text-amber-900">
                    <strong>Disclaimer:</strong> NeuralSense provides supportive
                    insights and does not replace professional evaluation.
                    Results are for informational purposes only.
                  </p>
                </div>

                <button
                  onClick={handleStartSession}
                  disabled={isAnalyzing}
                  className="px-8 py-4 bg-primary-500 text-white text-lg font-semibold rounded-full hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Starting...
                    </span>
                  ) : (
                    "Begin Stress Check"
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Face Capture */}
            {currentStep === "face" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-calm-900 mb-2">
                    Step 1: Facial Expression Capture
                  </h2>
                  <p className="text-calm-600">
                    Look at the camera naturally. We'll capture your facial
                    expression to detect stress indicators.
                  </p>
                </div>

                <CameraCapture
                  onCapture={handleFaceCapture}
                  onError={handleError}
                />

                {faceBlob && (
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium">
                      ✓ Photo captured successfully! Proceeding to voice
                      analysis...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Voice Recording */}
            {currentStep === "voice" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-calm-900 mb-2">
                    Step 2: Voice Recording
                  </h2>
                  <p className="text-calm-600">
                    Speak naturally for 10-20 seconds. You can talk about how
                    you're feeling, describe your day, or simply count aloud.
                  </p>
                </div>

                <AudioRecorder
                  onRecordingComplete={handleVoiceComplete}
                  onError={handleError}
                  minDuration={10}
                  maxDuration={20}
                />
              </div>
            )}

            {/* Step 4: Analyzing */}
            {currentStep === "analyzing" && (
              <div className="text-center py-12">
                <Loader
                  size="lg"
                  message="Analyzing your stress indicators..."
                />
                <p className="text-calm-600 mt-8 max-w-md mx-auto">
                  Our AI is processing your facial expression and voice
                  patterns. This may take a few moments...
                </p>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center text-sm text-calm-500">
            <p>
              Having trouble? Make sure you've granted camera and microphone
              permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
