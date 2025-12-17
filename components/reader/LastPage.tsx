"use client";

import React from "react";
import Image from "next/image";

export function LastPage() {
  return (
    <div className="h-full bg-black relative overflow-hidden">
      <div className="relative h-full flex flex-col p-2">
        {/* Main landscape image (top) */}
        <div className="relative h-[58%] rounded overflow-hidden">
          <Image
            src="/pagesimages/page-22.png"
            alt="Page 22"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Two side images (bottom) */}
        <div className="flex-1 flex gap-2 mt-2">
          <div className="relative flex-1 rounded overflow-hidden">
            <Image
              src="/pagesimages/page-20.png"
              alt="Page 20"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative flex-1 rounded overflow-hidden">
            <Image
              src="/pagesimages/page-21.png"
              alt="Page 21"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
