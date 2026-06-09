import React from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';

interface InfoProps {
  contentData: {
    locationName?: string;
    locationAddress?: string;
    locationMapsUrl?: string;
    eventTime?: string;
  };
}

export default function Info({ contentData }: InfoProps) {
  const name = contentData.locationName || 'Wedding Venue';
  const address = contentData.locationAddress || 'Venue Address';
  const time = contentData.eventTime || '10:00 - Finish';
  const mapsUrl = contentData.locationMapsUrl || 'https://maps.google.com';

  return (
    <section className="py-16 px-6 max-w-xl mx-auto text-center border-b border-muted">
      <h2 className="text-3xl font-extrabold mb-8 tracking-tight text-primary">
        Event Details
      </h2>
      <div className="space-y-6 text-left max-w-md mx-auto">
        <div className="flex items-start gap-4">
          <MapPin className="text-primary shrink-0 mt-1 w-6 h-6" />
          <div>
            <h3 className="font-bold text-lg mb-1">{name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{address}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Clock className="text-primary shrink-0 w-6 h-6" />
          <div>
            <h3 className="font-bold text-lg mb-1">Time</h3>
            <p className="text-muted-foreground text-sm">{time}</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-200 gap-2 focus:ring-2 focus:ring-primary/50 focus:outline-none"
        >
          <MapPin className="w-5 h-5" />
          Open Google Maps
        </a>
      </div>
    </section>
  );
}
