"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useStory } from "@/context/StoryContext";
import { fileToDataUrl } from "@/lib/utils";
import { Camera, User, X, Loader2, Sparkles } from "lucide-react";

interface ProfileFormProps {
  onComplete: () => void;
}

export function ProfileForm({ onComplete }: ProfileFormProps) {
  const { setChildProfile } = useStory();
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [gender, setGender] = useState<"boy" | "girl" | "neutral">("boy");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload photo to storage
  const uploadPhoto = useCallback(async (dataUrl: string) => {
    setIsUploading(true);
    setError("");

    try {
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64: dataUrl }),
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload photo");
      }

      const uploadData = await uploadResponse.json();
      setPhotoUrl(uploadData.url);
      setIsUploading(false);
    } catch (err) {
      setIsUploading(false);
      setError(err instanceof Error ? err.message : "Failed to upload photo");
    }
  }, []);

  const handleImageUpload = useCallback(
    async (file: File) => {
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
        // Upload to storage
        uploadPhoto(dataUrl);
      } catch {
        setError("Failed to load image");
      }
    },
    [uploadPhoto]
  );

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

    if (!photoUrl) {
      setError("Please upload your child's photo for personalization");
      return;
    }

    if (isUploading) {
      setError("Please wait for photo upload to complete");
      return;
    }

    // Set the child profile with the uploaded photo URL
    setChildProfile({
      name: name.trim(),
      image: photoUrl, // Use the uploaded URL for face swap
      gender,
      age: 5,
    });

    onComplete();
  };

  const removeImage = () => {
    setImage(null);
    setPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Create Your Personalized Story
        </h2>
        <p className="text-gray-600">
          Upload your child&apos;s photo and we&apos;ll create a magical adventure with them as the star!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Child&apos;s Photo <span className="text-red-500">*</span>
          </label>

          {image ? (
            <div className="space-y-4">
              <div className="relative w-40 h-40 mx-auto">
                <Image
                  src={image}
                  alt="Child's photo"
                  fill
                  className="object-cover rounded-full border-4 border-purple-200"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isUploading}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Upload Status */}
              {isUploading && (
                <p className="text-center text-sm text-purple-600">
                  <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                  Uploading photo...
                </p>
              )}
              {photoUrl && !isUploading && (
                <p className="text-center text-sm text-green-600">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Photo ready for personalization!
                </p>
              )}
            </div>
          ) : (
            <div
              className={`upload-zone rounded-2xl p-8 text-center cursor-pointer border-2 border-dashed transition-all ${
                isDragging
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-300 hover:border-purple-400"
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
              <p className="text-purple-600 text-xs mt-2">
                Your child&apos;s face will appear in every illustration!
              </p>
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
            Character Style
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "boy", label: "Boy", icon: "👦", outfit: "White Thobe" },
              { value: "girl", label: "Girl", icon: "👧", outfit: "Elegant Abaya" },
              { value: "neutral", label: "Neutral", icon: "🧒", outfit: "Simple Outfit" },
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
                <span className="text-sm text-gray-700 font-medium">{option.label}</span>
                <span className="text-xs text-gray-500 block">{option.outfit}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isUploading || !photoUrl}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Create My Story
            </>
          )}
        </Button>

        <p className="text-center text-xs text-gray-500">
          Your photo will be used to personalize the story illustrations.
          <br />
          Generation takes about 1-2 minutes for all 22 pages.
        </p>
      </form>
    </Card>
  );
}
