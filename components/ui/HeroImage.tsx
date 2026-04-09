"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Curated seasonal/monthly hero images from Unsplash
const MONTHLY_IMAGES: Record<number, { url: string; alt: string; credit: string }> = {
  0: {
    url: "https://images.unsplash.com/photo-1547754980-3df97fed72a8?w=800&q=80",
    alt: "January winter scene",
    credit: "Unsplash",
  },
  1: {
    url: "https://images.unsplash.com/photo-1614715838671-3f4a68db30b7?w=800&q=80",
    alt: "February winter light",
    credit: "Unsplash",
  },
  2: {
    url: "https://images.unsplash.com/photo-1490750967868-88df5691cc3d?w=800&q=80",
    alt: "March spring blossoms",
    credit: "Unsplash",
  },
  3: {
    url: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=80",
    alt: "April spring flowers",
    credit: "Unsplash",
  },
  4: {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    alt: "May garden",
    credit: "Unsplash",
  },
  5: {
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    alt: "June summer landscape",
    credit: "Unsplash",
  },
  6: {
    url: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80",
    alt: "July warm summer",
    credit: "Unsplash",
  },
  7: {
    url: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800&q=80",
    alt: "August sunset",
    credit: "Unsplash",
  },
  8: {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    alt: "September autumn",
    credit: "Unsplash",
  },
  9: {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    alt: "October fall foliage",
    credit: "Unsplash",
  },
  10: {
    url: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800&q=80",
    alt: "November late autumn",
    credit: "Unsplash",
  },
  11: {
    url: "https://images.unsplash.com/photo-1547754980-3df97fed72a8?w=800&q=80",
    alt: "December winter",
    credit: "Unsplash",
  },
};

// Better curated list
const HERO_IMAGES = [
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85", alt: "Mountain landscape at golden hour", month: "January" },
  { url: "https://images.unsplash.com/photo-1490750967868-88df5691cc3d?w=900&q=85", alt: "Spring cherry blossoms", month: "February" },
  { url: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&q=85", alt: "Wildflower meadow", month: "March" },
  { url: "https://images.unsplash.com/photo-1499744937866-d7e566a20a61?w=900&q=85", alt: "Coastal sunrise", month: "April" },
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85", alt: "Forest path in spring", month: "May" },
  { url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=85", alt: "Summer alpine meadow", month: "June" },
  { url: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=900&q=85", alt: "Tropical sunset", month: "July" },
  { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85", alt: "Warm summer evening", month: "August" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85", alt: "Serene beach", month: "September" },
  { url: "https://images.unsplash.com/photo-1476611338391-6f395a0dd82e?w=900&q=85", alt: "Autumn forest", month: "October" },
  { url: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=900&q=85", alt: "Misty autumn morning", month: "November" },
  { url: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=900&q=85", alt: "Winter snow scene", month: "December" },
];

interface HeroImageProps {
  currentMonth: Date;
}

export default function HeroImage({ currentMonth }: HeroImageProps) {
  const [loaded, setLoaded] = useState(false);
  const monthIndex = currentMonth.getMonth();
  const image = HERO_IMAGES[monthIndex];
  const monthName = format(currentMonth, "MMMM");
  const year = format(currentMonth, "yyyy");

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-ink-100 dark:bg-ink-900 min-h-[220px] lg:min-h-0">
      {/* Image */}
      <motion.img
        key={image.url}
        src={image.url}
        alt={image.alt}
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.05 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Loading skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-ink-200 to-ink-100 dark:from-ink-800 dark:to-ink-900 animate-pulse" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/30 via-transparent to-transparent" />

      {/* Month label overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <motion.div
          key={monthName}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="text-white/50 text-xs font-body tracking-[0.2em] uppercase font-medium mb-0.5">
            {year}
          </p>
          <h1 className="text-white font-display text-3xl lg:text-4xl font-bold tracking-tight leading-none">
            {monthName}
          </h1>
          <p className="text-white/60 text-xs mt-2 font-body">{image.alt}</p>
        </motion.div>
      </div>

      {/* Decorative corner */}
      <div className="absolute top-4 right-4">
        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <span className="text-white/70 text-[10px] font-display font-bold">
            {format(currentMonth, "MM")}
          </span>
        </div>
      </div>
    </div>
  );
}
