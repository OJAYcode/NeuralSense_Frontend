"use client";

import React, { useEffect } from "react";
import { clsx } from "clsx";

/**
 * ConsentModal Component
 * Displays consent request for camera, microphone, and data processing
 */
interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onAccept,
  onDecline,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-modal-title"
    >
      <div
        className={clsx(
          "bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",
          "transform transition-all duration-300 ease-out",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-calm-200">
          <h2
            id="consent-modal-title"
            className="text-2xl font-bold text-calm-900"
          >
            Privacy & Consent
          </h2>
          <p className="text-sm text-calm-600 mt-2">
            We respect your privacy and need your explicit consent to proceed.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Camera Consent */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
              📷
            </div>
            <div>
              <h3 className="font-semibold text-calm-900 mb-2">
                Camera Access
              </h3>
              <p className="text-sm text-calm-700 leading-relaxed">
                We need access to your camera to capture a single photo of your
                facial expression. This image will be analyzed to detect stress
                indicators and will be processed securely on our server.
              </p>
            </div>
          </div>

          {/* Microphone Consent */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
              🎤
            </div>
            <div>
              <h3 className="font-semibold text-calm-900 mb-2">
                Microphone Access
              </h3>
              <p className="text-sm text-calm-700 leading-relaxed">
                We need access to your microphone to record a short audio clip
                (10-20 seconds) of your voice. This recording will be analyzed
                for vocal stress patterns and processed securely.
              </p>
            </div>
          </div>

          {/* Data Processing */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
              🔒
            </div>
            <div>
              <h3 className="font-semibold text-calm-900 mb-2">
                Data Processing & Privacy
              </h3>
              <p className="text-sm text-calm-700 leading-relaxed">
                Your captured data (photo and audio) will be:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-calm-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>Transmitted securely via encrypted connections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>Processed by AI models for stress detection only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>Stored temporarily for session analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>Deleted after your session ends (if guest user)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>Never shared with third parties</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-900">
              <strong>Important:</strong> NeuralSense provides supportive
              insights and does NOT offer medical diagnosis. This is an
              educational tool designed to raise awareness about stress
              indicators. If you're experiencing persistent stress, please
              consult a qualified mental health professional.
            </p>
          </div>

          {/* Your Rights */}
          <div className="p-4 bg-calm-50 rounded-lg">
            <h4 className="font-semibold text-calm-900 mb-2">Your Rights</h4>
            <ul className="space-y-1 text-sm text-calm-700">
              <li>• You can deny camera or microphone access at any time</li>
              <li>• You can stop the session at any point</li>
              <li>
                • You can request deletion of your data (for registered users)
              </li>
              <li>• You maintain full control over your information</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-calm-200 bg-calm-50">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onDecline}
              className={clsx(
                "px-6 py-3 rounded-lg font-medium transition-colors",
                "border-2 border-calm-300 text-calm-700 hover:bg-calm-100"
              )}
            >
              I Do Not Consent
            </button>
            <button
              onClick={onAccept}
              className={clsx(
                "px-6 py-3 rounded-lg font-semibold text-white transition-all transform",
                "bg-primary-500 hover:bg-primary-600 active:scale-95",
                "shadow-md hover:shadow-lg"
              )}
            >
              I Understand & Consent
            </button>
          </div>
          <p className="text-xs text-calm-500 text-center mt-4">
            By clicking "I Understand & Consent", you agree to the terms
            described above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
