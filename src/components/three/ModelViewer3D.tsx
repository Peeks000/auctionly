"use client";

import React, { useState } from "react";
import Image from "next/image";
import CanvasFallback from "./CanvasFallback";
import { Box, Image as ImageIcon, Sparkles, RotateCw } from "lucide-react";

interface ModelViewer3DProps {
  modelUrl?: string | null;
  primaryImageUrl: string;
  galleryUrls?: string[];
  title: string;
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  modelUrl,
  primaryImageUrl,
  galleryUrls = [],
  title,
}) => {
  const [activeTab, setActiveTab] = useState<"3d" | "photos">("3d");
  const [selectedImage, setSelectedImage] = useState<string>(primaryImageUrl);

  const allImages = [primaryImageUrl, ...galleryUrls];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Mode Selector Tabs (3D Model vs High-Res Photography) */}
      <div className="flex items-center justify-between border-b border-luxury-champagne/15 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("3d")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-luxury transition-all ${
              activeTab === "3d"
                ? "bg-luxury-gold/15 text-luxury-gold border-b-2 border-luxury-gold font-medium"
                : "text-luxury-champagne/60 hover:text-luxury-ivory"
            }`}
          >
            <Box size={14} />
            <span>3D Immersive Viewer</span>
          </button>

          <button
            onClick={() => setActiveTab("photos")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-luxury transition-all ${
              activeTab === "photos"
                ? "bg-luxury-gold/15 text-luxury-gold border-b-2 border-luxury-gold font-medium"
                : "text-luxury-champagne/60 hover:text-luxury-ivory"
            }`}
          >
            <ImageIcon size={14} />
            <span>High-Res Gallery ({allImages.length})</span>
          </button>
        </div>

        <span className="hidden sm:inline-block text-[10px] tracking-wider uppercase text-luxury-muted">
          PBR Real-Time Lighting
        </span>
      </div>

      {/* Main Display Stage */}
      {activeTab === "3d" ? (
        <div className="relative">
          <CanvasFallback
            primaryImage={primaryImageUrl}
            title={title}
            altText={`3D Presentation of ${title}`}
          />
          {modelUrl && (
            <div className="absolute top-4 right-4 bg-luxury-black/90 px-2.5 py-1 border border-luxury-gold/40 text-[9px] uppercase tracking-wider text-luxury-gold flex items-center gap-1">
              <Sparkles size={10} />
              <span>GLB Model Ready</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="relative w-full h-[450px] bg-luxury-dark rounded-sm border border-luxury-champagne/15 overflow-hidden">
            <Image
              src={selectedImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-4"
              priority
            />
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {allImages.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(url)}
                className={`relative w-16 h-16 shrink-0 rounded-sm overflow-hidden border transition-all ${
                  selectedImage === url
                    ? "border-luxury-gold ring-1 ring-luxury-gold"
                    : "border-luxury-champagne/20 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer3D;
