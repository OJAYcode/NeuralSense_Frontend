"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { clsx } from "clsx";

/**
 * AudioRecorder Component
 * Handles microphone access and audio recording
 */
interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onError?: (error: string) => void;
  minDuration?: number; // seconds
  maxDuration?: number; // seconds
  className?: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onError,
  minDuration = 10,
  maxDuration = 20,
  className,
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const durationRef = useRef<number>(0); // Track actual duration

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  /**
   * Request microphone permission
   */
  const requestPermission = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setPermissionGranted(true);

      // Setup audio level visualization
      setupAudioVisualization(stream);

      return true;
    } catch (err: any) {
      const errorMessage =
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Microphone access denied. Please grant microphone permission to continue."
          : "Unable to access microphone. Please ensure your device has a microphone.";

      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    }
  }, [onError]);

  /**
   * Setup audio level visualization
   */
  const setupAudioVisualization = useCallback(
    (stream: MediaStream) => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      microphone.connect(analyser);

      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255); // Normalize to 0-1

        if (isRecording) {
          requestAnimationFrame(updateLevel);
        }
      };

      updateLevel();
    },
    [isRecording]
  );

  /**
   * Start recording
   */
  const startRecording = useCallback(async () => {
    if (!streamRef.current) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    if (!streamRef.current) return;

    try {
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: "audio/webm",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const actualDuration = durationRef.current;

        console.log(
          "Recording stopped. Duration:",
          actualDuration,
          "Min required:",
          minDuration,
          "Blob size:",
          audioBlob.size,
          "bytes",
          "Chunks collected:",
          chunksRef.current.length
        );

        // Check if blob is empty or too small (less than 1KB is likely corrupt)
        if (audioBlob.size < 1000) {
          const errorMsg = `Recording failed. Audio file too small (${audioBlob.size} bytes). Please try again.`;
          console.error(errorMsg);
          setError(errorMsg);
          onError?.(errorMsg);
          return;
        }

        // Use >= for validation (10 seconds or more is valid)
        if (actualDuration >= minDuration) {
          console.log("Recording valid, calling onRecordingComplete");
          onRecordingComplete(audioBlob);
        } else {
          const errorMsg = `Recording too short. Please record for at least ${minDuration} seconds. You recorded ${actualDuration} seconds.`;
          console.log(errorMsg);
          setError(errorMsg);
          onError?.(errorMsg);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      // Request data every 1000ms to ensure chunks are collected
      // This is crucial for getting a valid audio blob
      mediaRecorder.start(1000);
      setIsRecording(true);
      setDuration(0);
      durationRef.current = 0;

      // Start timer
      timerRef.current = setInterval(() => {
        durationRef.current += 1;
        setDuration(durationRef.current);

        // Auto-stop at max duration
        if (durationRef.current >= maxDuration) {
          // Stop without calling stopRecording to avoid dependency issues
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            clearInterval(timerRef.current!);
            timerRef.current = null;
            setAudioLevel(0);
          }
        }
      }, 1000);
    } catch (err: any) {
      setError("Failed to start recording. Please try again.");
      onError?.("Failed to start recording");
    }
  }, [
    minDuration,
    maxDuration,
    onRecordingComplete,
    onError,
    requestPermission,
  ]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Stop audio visualization
      setAudioLevel(0);
    }
  }, [isRecording]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  /**
   * Format duration as MM:SS
   */
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={clsx("flex flex-col items-center gap-6", className)}>
      {/* Recording Visualizer */}
      <div className="relative w-full max-w-md">
        {/* Audio Level Bars */}
        <div className="flex items-end justify-center gap-2 h-32 mb-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                "w-3 rounded-full transition-all duration-100",
                isRecording ? "bg-primary-500" : "bg-calm-200"
              )}
              style={{
                height: isRecording
                  ? `${Math.max(
                      10,
                      audioLevel * 100 * (1 + Math.random() * 0.5)
                    )}%`
                  : "20%",
              }}
            />
          ))}
        </div>

        {/* Duration Display */}
        {isRecording && (
          <div className="text-center">
            <p className="text-4xl font-bold text-calm-900 mb-2">
              {formatDuration(duration)}
            </p>
            <p className="text-sm text-calm-600">
              {duration < minDuration
                ? `Record for at least ${minDuration} seconds`
                : duration >= maxDuration
                ? "Maximum duration reached"
                : `Recording... (max ${maxDuration}s)`}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        {isRecording && (
          <div className="mt-4 w-full bg-calm-100 rounded-full h-2">
            <div
              className={clsx(
                "h-2 rounded-full transition-all duration-1000",
                duration < minDuration ? "bg-amber-400" : "bg-green-500"
              )}
              style={{ width: `${(duration / maxDuration) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-md p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className={clsx(
              "px-8 py-3 rounded-full font-semibold text-white transition-all transform",
              "bg-red-500 hover:bg-red-600 active:scale-95",
              "shadow-lg hover:shadow-xl"
            )}
            aria-label="Start recording"
          >
            <span className="flex items-center gap-2">🎤 Start Recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            disabled={duration < minDuration}
            className={clsx(
              "px-8 py-3 rounded-full font-semibold text-white transition-all transform",
              "bg-calm-600 hover:bg-calm-700 active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-lg hover:shadow-xl"
            )}
            aria-label="Stop recording"
          >
            <span className="flex items-center gap-2">
              ⏹️ Stop Recording
              {duration < minDuration && (
                <span className="text-xs">
                  ({minDuration - duration}s remaining)
                </span>
              )}
            </span>
          </button>
        )}
      </div>

      {/* Instructions */}
      {!isRecording && (
        <div className="text-center max-w-md space-y-2">
          <p className="text-sm text-calm-600">
            Click the button above to start recording your voice.
          </p>
          <p className="text-xs text-calm-500">
            Recording duration: {minDuration}-{maxDuration} seconds
          </p>
        </div>
      )}

      {/* Recording Instructions */}
      {isRecording && (
        <div className="text-center max-w-md">
          <p className="text-sm text-calm-600">
            Speak naturally about how you're feeling or describe your current
            state.
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
