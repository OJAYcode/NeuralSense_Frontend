"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { clsx } from "clsx";

/**
 * CameraCapture Component
 * Handles camera access, preview, and image capture
 */
interface CameraCaptureProps {
  onCapture: (imageBlob: Blob) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onError,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  /**
   * Initialize camera stream
   */
  const initializeCamera = useCallback(async () => {
    try {
      setError(null);
      setPermissionDenied(false);

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      streamRef.current = stream;

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsReady(true);
        };
      }
    } catch (err: any) {
      const errorMessage =
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Camera access denied. Please grant camera permission to continue."
          : "Unable to access camera. Please ensure your device has a camera and try again.";

      setError(errorMessage);
      setPermissionDenied(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
      );
      onError?.(errorMessage);
    }
  }, [onError]);

  /**
   * Capture image from video stream
   */
  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isReady) return;

    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      setError("Unable to create canvas context");
      setIsCapturing(false);
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCapture(blob);
        } else {
          setError("Failed to capture image");
          onError?.("Failed to capture image");
        }
        setIsCapturing(false);
      },
      "image/jpeg",
      0.9
    );
  }, [isReady, onCapture, onError]);

  /**
   * Stop camera stream
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsReady(false);
  }, []);

  /**
   * Initialize camera on mount
   */
  useEffect(() => {
    initializeCamera();

    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [initializeCamera, stopCamera]);

  return (
    <div className={clsx("flex flex-col items-center gap-4", className)}>
      {/* Video Preview */}
      <div className="relative w-full max-w-2xl aspect-video bg-calm-900 rounded-xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={clsx("w-full h-full object-cover", !isReady && "hidden")}
          aria-label="Camera preview"
        />

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Loading State */}
        {!isReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4" />
              <p className="text-sm">Initializing camera...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center text-white bg-red-500/20 backdrop-blur-sm rounded-lg p-6 max-w-md">
              <div className="text-4xl mb-4">📷</div>
              <p className="text-sm mb-4">{error}</p>
              {permissionDenied && (
                <button
                  onClick={initializeCamera}
                  className="px-4 py-2 bg-white text-calm-900 rounded-lg font-medium hover:bg-calm-50 transition-colors"
                >
                  Retry Camera Access
                </button>
              )}
            </div>
          </div>
        )}

        {/* Capture Flash Effect */}
        {isCapturing && (
          <div className="absolute inset-0 bg-white animate-pulse" />
        )}
      </div>

      {/* Capture Button */}
      {isReady && (
        <button
          onClick={captureImage}
          disabled={isCapturing}
          className={clsx(
            "px-8 py-3 rounded-full font-semibold text-white transition-all transform",
            "bg-primary-500 hover:bg-primary-600 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "shadow-lg hover:shadow-xl"
          )}
          aria-label="Capture image"
        >
          {isCapturing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Capturing...
            </span>
          ) : (
            <span className="flex items-center gap-2">📸 Capture Photo</span>
          )}
        </button>
      )}

      {/* Instructions */}
      {isReady && (
        <p className="text-sm text-calm-600 text-center max-w-md">
          Position your face in the center of the frame and click capture when
          ready.
        </p>
      )}
    </div>
  );
};

export default CameraCapture;
