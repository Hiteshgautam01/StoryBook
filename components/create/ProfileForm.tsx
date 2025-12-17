"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useStory } from "@/context/StoryContext";
import { fileToDataUrl } from "@/lib/utils";
import { Upload, Camera, User, X } from "lucide-react";

interface ProfileFormProps {
  onComplete: () => void;
}

export function ProfileForm({ onComplete }: ProfileFormProps) {
  const { setChildProfile } = useStory();
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [gender, setGender] = useState<"boy" | "girl" | "neutral">("neutral");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setImage(dataUrl);
      setError("");
    } catch {
      setError("Failed to load image");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your child's name");
      return;
    }

    setChildProfile({
      name: name.trim(),
      image,
      gender,
      age: 5,
    });

    onComplete();
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Tell Us About Your Star
        </h2>
        <p className="text-gray-600">
          Enter your child&apos;s name and upload a photo to personalize their adventure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Child&apos;s Photo (Optional)
          </label>

          {image ? (
            <div className="relative w-40 h-40 mx-auto">
              <Image
                src={image}
                alt="Child's photo"
                fill
                className="object-cover rounded-full border-4 border-purple-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className={`upload-zone rounded-2xl p-8 text-center cursor-pointer ${
                isDragging ? "drag-over" : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <Camera className="w-10 h-10 text-purple-500" />
              </div>
              <p className="text-gray-600 mb-2">
                Drag & drop a photo here, or click to browse
              </p>
              <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Name Input */}
        <Input
          label="Child's Name"
          placeholder="Enter your child's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Character Pronouns
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "boy", label: "He/Him", icon: "👦" },
              { value: "girl", label: "She/Her", icon: "👧" },
              { value: "neutral", label: "They/Them", icon: "🧒" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setGender(option.value as typeof gender)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  gender === option.value
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <span className="text-2xl mb-1 block">{option.icon}</span>
                <span className="text-sm text-gray-700">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <Button type="submit" className="w-full" size="lg">
          <User className="w-5 h-5 mr-2" />
          Continue to Choose Theme
        </Button>
      </form>
    </Card>
  );
}
