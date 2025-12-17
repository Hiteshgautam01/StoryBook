"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/components/reader/Book";
import { useStory } from "@/context/StoryContext";

export default function ReaderPage() {
  const router = useRouter();
  const { currentStory, childProfile } = useStory();

  useEffect(() => {
    if (!childProfile) {
      router.push("/");
    }
  }, [childProfile, router]);

  if (!currentStory) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <p>Loading story...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Book />
    </main>
  );
}
