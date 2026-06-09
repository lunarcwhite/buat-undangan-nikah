'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryProps {
  galleryUrls: string[];
}

export default function Gallery({ galleryUrls }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === null ? null : (prev + 1) % galleryUrls.length));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === null ? null : (prev - 1 + galleryUrls.length) % galleryUrls.length));
  };

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, galleryUrls, handleNext, handlePrev]);

  if (!galleryUrls || galleryUrls.length === 0) return null;

  return (
    <section className="py-16 px-6 max-w-2xl mx-auto border-b border-muted">
      <h2 className="text-3xl font-extrabold text-center mb-8 tracking-tight text-primary">
        Photo Gallery
      </h2>

      {/* Responsive Masonry column layout */}
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {galleryUrls.map((url, idx) => (
          <div
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className="break-inside-avoid overflow-hidden rounded-2xl border border-muted/50 cursor-pointer shadow-sm hover:shadow-md hover:border-primary/20 transition group relative"
          >
            <img
              src={url}
              alt={`Gallery Image ${idx + 1}`}
              className="w-full h-auto object-cover group-hover:scale-[1.02] transition duration-350 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
          </div>
        ))}
      </div>

      {/* Lightbox Slideshow Modal */}
      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col justify-between items-center p-4 select-none">
          {/* Top header bar */}
          <div className="w-full flex justify-between items-center text-slate-400 text-sm max-w-5xl px-4 py-2">
            <span>
              {activeIndex + 1} / {galleryUrls.length}
            </span>
            <button
              onClick={() => setActiveIndex(null)}
              className="p-2 hover:bg-slate-800 rounded-full transition text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Slideshow image and navigations */}
          <div className="flex-1 w-full flex items-center justify-between max-w-5xl relative gap-4">
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-4 z-[10000] p-3 bg-slate-900/60 hover:bg-slate-800 text-white rounded-full transition cursor-pointer border border-slate-800/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={galleryUrls[activeIndex]}
                alt={`Slideshow ${activeIndex + 1}`}
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl animate-fade-in"
              />
            </div>

            <button
              onClick={handleNext}
              className="absolute right-2 md:right-4 z-[10000] p-3 bg-slate-900/60 hover:bg-slate-800 text-white rounded-full transition cursor-pointer border border-slate-800/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom spacer */}
          <div className="h-12" />
        </div>
      )}
    </section>
  );
}
