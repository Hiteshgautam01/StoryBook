"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useStory } from "@/context/StoryContext";
import { Sparkles, BookOpen } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { setChildProfile, setChildDescription } = useStory();
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [gender, setGender] = useState<"boy" | "girl">("boy");
  const [error, setError] = useState("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  // Quick start with demo/static story
  const handleDemoStart = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    setChildProfile({
      name: name.trim(),
      image,
      gender,
      age: 5,
    });

    // Set a default description for demo mode
    const defaultDescription = gender === "boy"
      ? "A young boy with warm brown skin, round cherubic face, bright dark brown eyes, and a joyful smile"
      : "A young girl with warm brown skin, round cherubic face, bright dark brown eyes, and a gentle smile";
    setChildDescription(defaultDescription);

    router.push("/reader");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-4">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Lubab
          </h1>
          <p className="text-white/70 text-center mb-8">
            رحلة والصقر الذهبي
          </p>

          <form onSubmit={handleDemoStart} className="space-y-6">
            {/* Image Upload */}
            <div className="flex flex-col items-center">
              <label className="cursor-pointer">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 bg-white/10 flex items-center justify-center">
                  {image ? (
                    <Image
                      src={image}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white/50 text-sm text-center px-2">
                      Click to add photo
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-white/50 text-xs mt-2">Optional</p>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter child's name"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50"
              />
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender("boy")}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    gender === "boy"
                      ? "border-white bg-white/20 text-white"
                      : "border-white/20 text-white/60 hover:border-white/40"
                  }`}
                >
                  Boy
                </button>
                <button
                  type="button"
                  onClick={() => setGender("girl")}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    gender === "girl"
                      ? "border-white bg-white/20 text-white"
                      : "border-white/20 text-white/60 hover:border-white/40"
                  }`}
                >
                  Girl
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            {/* Demo Mode Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Preview Story (Demo)
            </button>
          </form>
        </div>

        {/* AI Generation Link */}
        <Link
          href="/create"
          className="block w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all text-center"
        >
          <Sparkles className="w-5 h-5 inline mr-2" />
          Create Personalized Story with AI
        </Link>
        <p className="text-white/50 text-xs text-center mt-2">
          Generate unique illustrations featuring your child
        </p>
      </div>
    </main>
  );
}
