'use client';

import React, { useEffect } from 'react';
import { MailOpen } from 'lucide-react';

interface CoverOverlayProps {
  contentData: {
    brideName?: string;
    bride_name?: string;
    groomName?: string;
    groom_name?: string;
    eventDate?: string;
    event_date?: string;
  };
  onOpen: () => void;
}

export default function CoverOverlay({ contentData, onOpen }: CoverOverlayProps) {
  const bride = contentData.brideName || contentData.bride_name || 'Bride';
  const groom = contentData.groomName || contentData.groom_name || 'Groom';
  const rawDate = contentData.eventDate || contentData.event_date;
  const dateStr = rawDate
    ? new Date(rawDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  useEffect(() => {
    // Save original overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/45 backdrop-blur-md p-6 animate-fade-in">
      <div className="max-w-md w-full text-center bg-background/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-card-foreground">
        <span className="text-sm tracking-widest text-muted-foreground uppercase mb-2">
          You are invited to the wedding of
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold font-serif tracking-tight text-primary my-6 leading-tight drop-shadow-sm">
          {bride} & {groom}
        </h1>
        {dateStr && (
          <p className="text-md font-medium text-muted-foreground tracking-wide mb-8">
            {dateStr}
          </p>
        )}
        <button
          onClick={onOpen}
          className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-base"
        >
          <MailOpen className="w-5 h-5 animate-pulse" />
          Open Invitation
        </button>
      </div>
    </div>
  );
}
