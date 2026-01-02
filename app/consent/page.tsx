"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useConsentStore } from "@/lib/store";
import ConsentModal from "@/components/ConsentModal";

export default function ConsentPage() {
  const router = useRouter();
  const { giveConsent, hasGivenConsent } = useConsentStore();
  const [showModal, setShowModal] = useState(true);

  const handleAccept = () => {
    giveConsent(true, true, true);
    setShowModal(false);
    router.push("/session");
  };

  const handleDecline = () => {
    setShowModal(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-50 to-white">
      <ConsentModal
        isOpen={showModal}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />

      {!showModal && !hasGivenConsent && (
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-3xl font-bold text-calm-900 mb-4">
              Consent Required
            </h1>
            <p className="text-calm-600 mb-8">
              You need to provide consent to use camera and microphone access to
              proceed with stress detection.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 border-2 border-calm-300 text-calm-700 font-medium rounded-lg hover:bg-calm-50 transition-colors"
              >
                Back to Home
              </Link>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
              >
                Review Consent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
