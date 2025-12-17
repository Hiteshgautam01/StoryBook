"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStory } from "@/context/StoryContext";

export default function Home() {
  const router = useRouter();
  const { setChildProfile } = useStory();
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

  const handleSubmit = (e: React.FormEvent) => {
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

    router.push("/reader");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Lubab
        </h1>
        <p className="text-white/70 text-center mb-8">
          Enter details to start the story
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter name"
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

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-white/90 transition-colors"
          >
            Start Reading
          </button>
        </form>
      </div>
    </main>
  );
}
