'use client';

import React, { useState } from 'react';
import CoverOverlay from './CoverOverlay';
import AudioPlayer from './AudioPlayer';
import Gallery from './Gallery';

interface InvitationClientContainerProps {
  contentData: any;
  invitationId: string;
  children: React.ReactNode;
}

export default function InvitationClientContainer({
  contentData,
  invitationId,
  children
}: InvitationClientContainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const galleryUrls = contentData?.gallery_urls || [];
  const audioUrl = contentData?.audio_url || '';

  return (
    <>
      {!isOpen && (
        <CoverOverlay
          contentData={contentData}
          onOpen={() => setIsOpen(true)}
        />
      )}
      <div className={isOpen ? '' : 'h-screen overflow-hidden'}>
        {children}
        <Gallery galleryUrls={galleryUrls} />
      </div>
      <AudioPlayer audioUrl={audioUrl} isOpen={isOpen} />
    </>
  );
}
