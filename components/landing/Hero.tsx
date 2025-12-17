"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BookOpen, Sparkles, Stars } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute star text-yellow-300"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
          >
            *
          </div>
        ))}
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-400/20 rounded-full animate-float" />
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-yellow-400/20 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-cyan-400/20 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Sparkle badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Make your child the star of their own adventure</span>
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Create{" "}
          <span className="relative inline-block">
            <span className="relative z-10">Magical</span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 12"
              fill="none"
            >
              <path
                d="M2 10C50 2 150 2 198 10"
                stroke="#F472B6"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <br />
          Storybooks
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
          Personalized children&apos;s stories featuring your little one as the hero.
          Beautiful illustrations, engaging adventures, and memories that last forever.
        </p>

        {/* CTA Button */}
        <Link href="/create">
          <Button size="lg" className="text-xl px-10 py-5 group">
            <BookOpen className="w-6 h-6 mr-2 group-hover:animate-pulse" />
            Create Your Story
            <Stars className="w-5 h-5 ml-2" />
          </Button>
        </Link>

        {/* Book preview mockup */}
        <div className="mt-16 relative">
          <div className="relative mx-auto w-full max-w-2xl">
            {/* Book shadow */}
            <div className="absolute inset-x-10 bottom-0 h-8 bg-black/30 blur-2xl rounded-full" />

            {/* Book mockup */}
            <div className="relative bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg shadow-2xl overflow-hidden aspect-[16/10] border-4 border-amber-200">
              {/* Book spine */}
              <div className="absolute left-1/2 top-0 bottom-0 w-4 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 transform -translate-x-1/2 book-spine-shadow" />

              {/* Left page */}
              <div className="absolute left-0 top-0 bottom-0 w-1/2 p-6 flex flex-col justify-center items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-5xl mb-4">
                  ?
                </div>
                <p className="text-amber-900/70 text-center font-storybook text-sm">
                  Your child&apos;s photo here
                </p>
              </div>

              {/* Right page */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-amber-900 mb-2 font-storybook">
                  Your Child&apos;s Adventure
                </h3>
                <p className="text-amber-800/80 text-sm font-storybook leading-relaxed">
                  &ldquo;Once upon a time, [Your Child] discovered a magical world full of wonder and excitement...&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
