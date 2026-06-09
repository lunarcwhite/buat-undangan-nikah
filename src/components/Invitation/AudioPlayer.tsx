'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  isOpen: boolean;
}

export default function AudioPlayer({ audioUrl, isOpen }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen && audioUrl && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Playback blocked or failed:', err);
        });
    }
  }, [isOpen, audioUrl]);

  if (!audioUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Failed to play audio:', err);
        });
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop className="hidden" />
      {isOpen && (
        <button
          onClick={togglePlay}
          className="fixed bottom-6 right-6 z-[999] p-4 bg-primary hover:bg-primary/95 text-primary-foreground rounded-full shadow-2xl hover:shadow-primary/30 transition transform hover:-translate-y-1 active:translate-y-0 cursor-pointer flex items-center justify-center border border-primary-foreground/10"
          title={isPlaying ? 'Mute Music' : 'Play Music'}
        >
          {isPlaying ? (
            <Volume2 className="w-6 h-6 animate-bounce" />
          ) : (
            <VolumeX className="w-6 h-6" />
          )}
        </button>
      )}
    </>
  );
}
