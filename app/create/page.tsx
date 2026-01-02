"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProfileForm } from "@/components/create/ProfileForm";
import { ArrowLeft } from "lucide-react";

export default function CreatePage() {
  const router = useRouter();

  const handleComplete = () => {
    // Navigate to generation page after profile is complete
    router.push("/generate");
  };

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

      {/* Profile Form */}
      <ProfileForm onComplete={handleComplete} />
    </main>
  );
}
