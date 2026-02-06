"use client";

import { useEffect, useRef } from "react";

const ESCAPE_SITES = [
  "https://en.wikipedia.org/wiki/Cat",
  "https://www.boredpanda.com/cute-cats/",
  "https://www.artoftea.com/blogs/tea-101",
  "https://en.wikipedia.org/wiki/History_of_tea",
  "https://www.weather.com/",
  "https://www.allrecipes.com/recipe/23891/grilled-cheese-sandwich/",
  "https://en.wikipedia.org/wiki/List_of_reportedly_haunted_locations",
  "https://www.google.com/maps/@27.1751,-78.0421,17z",
  "https://en.wikipedia.org/wiki/Rubber_duck_debugging",
  "https://www.youtube.com/watch?v=J---aiyznGQ",
];

const STORAGE_KEY = "panic-queue";

function getNextSite(): string {
  try {
    let queue: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (queue.length === 0) {
      // Shuffle a fresh copy of all sites
      queue = [...ESCAPE_SITES].sort(() => Math.random() - 0.5);
    }
    const next = queue.shift()!;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    return next;
  } catch {
    return ESCAPE_SITES[Math.floor(Math.random() * ESCAPE_SITES.length)];
  }
}

const CORNER_ZONE = 120; // pixels from top-right corner
const SPEED_THRESHOLD = 1800; // pixels per second
const SAMPLE_WINDOW = 200; // ms to measure velocity over

export function PanicCorner() {
  const positionsRef = useRef<{ x: number; y: number; t: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const positions = positionsRef.current;

      positions.push({ x: e.clientX, y: e.clientY, t: now });

      // Keep only recent positions within the sample window
      while (positions.length > 0 && now - positions[0].t > SAMPLE_WINDOW) {
        positions.shift();
      }

      // Check if cursor is in the upper-right corner zone
      const inCorner =
        e.clientX > window.innerWidth - CORNER_ZONE && e.clientY < CORNER_ZONE;

      if (!inCorner || positions.length < 2) return;

      // Calculate speed from oldest sample to current position
      const oldest = positions[0];
      const dt = (now - oldest.t) / 1000; // seconds
      if (dt < 0.02) return; // need at least 20ms of data

      const dx = e.clientX - oldest.x;
      const dy = e.clientY - oldest.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = distance / dt;

      // Just needs to be moving fast into the corner — any direction
      if (speed > SPEED_THRESHOLD) {
        positionsRef.current = [];
        window.location.href = getNextSite();
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return null;
}
