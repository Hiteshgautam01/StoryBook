"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProfileForm } from "@/components/create/ProfileForm";
import { ThemeSelector } from "@/components/create/ThemeSelector";
import { ArrowLeft } from "lucide-react";

type Step = "profile" | "theme";

export default function CreatePage() {
  const [step, setStep] = useState<Step>("profile");

  return (
    <main className="min-h-screen py-12 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Steps indicator */}
      <div className="max-w-md mx-auto mb-12">
        <div className="flex items-center justify-center gap-4">
          <div
            className={`flex items-center gap-2 ${
              step === "profile" ? "text-white" : "text-white/50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === "profile"
                  ? "bg-white text-purple-600"
                  : "bg-white/20 text-white"
              }`}
            >
              1
            </div>
            <span className="text-sm font-medium">Profile</span>
          </div>

          <div className="w-12 h-0.5 bg-white/30" />

          <div
            className={`flex items-center gap-2 ${
              step === "theme" ? "text-white" : "text-white/50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === "theme"
                  ? "bg-white text-purple-600"
                  : "bg-white/20 text-white"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium">Theme</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="transition-all duration-500">
        {step === "profile" ? (
          <ProfileForm onComplete={() => setStep("theme")} />
        ) : (
          <ThemeSelector onBack={() => setStep("profile")} />
        )}
      </div>
    </main>
  );
}
