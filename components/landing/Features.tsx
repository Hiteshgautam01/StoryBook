"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Camera, Palette, BookOpen, ArrowLeftRight } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Upload Photo",
    description: "Add your child's photo to make them the star of the story",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Palette,
    title: "Choose Theme",
    description: "Pick from magical kingdoms, space adventures, and more",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: BookOpen,
    title: "Read Together",
    description: "Enjoy beautiful illustrations and engaging storytelling",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: ArrowLeftRight,
    title: "Flip Pages",
    description: "Experience realistic page-turning like a real storybook",
    color: "from-amber-500 to-orange-500",
  },
];

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Creating a personalized storybook is as easy as 1-2-3
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} hover className="text-center">
              <CardContent>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
