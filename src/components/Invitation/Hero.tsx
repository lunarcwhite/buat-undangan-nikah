import React from 'react';

interface HeroProps {
  contentData: {
    brideName?: string;
    groomName?: string;
    eventDate?: string;
  };
}

export default function Hero({ contentData }: HeroProps) {
  const bride = contentData.brideName || 'Bride';
  const groom = contentData.groomName || 'Groom';
  const dateStr = contentData.eventDate
    ? new Date(contentData.eventDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-4 border-b border-muted bg-gradient-to-b from-primary/5 to-transparent">
      <h2 className="text-xl tracking-widest text-muted-foreground uppercase mb-4">
        The Wedding of
      </h2>
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-primary drop-shadow-sm font-serif">
        {bride} & {groom}
      </h1>
      {dateStr && (
        <p className="text-lg font-medium text-muted-foreground tracking-wide">
          {dateStr}
        </p>
      )}
    </section>
  );
}
