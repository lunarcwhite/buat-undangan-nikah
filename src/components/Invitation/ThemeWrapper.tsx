'use client';

import React from 'react';
import { Inter, Playfair_Display, Outfit } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

interface ThemeWrapperProps {
  themeConfig: {
    primaryColor?: string;
    fontFamily?: string;
  };
  children: React.ReactNode;
}

export default function ThemeWrapper({ themeConfig, children }: ThemeWrapperProps) {
  const primaryColor = themeConfig.primaryColor || '#d97706';
  const fontFamily = themeConfig.fontFamily || 'sans';

  // Map requested fonts to variables loaded via next/font
  let fontClass = inter.variable;
  let fontVarValue = 'var(--font-sans)';

  if (fontFamily === 'serif') {
    fontClass = playfair.variable;
    fontVarValue = 'var(--font-serif)';
  } else if (fontFamily === 'outfit') {
    fontClass = outfit.variable;
    fontVarValue = 'var(--font-outfit)';
  }

  const wrapperStyle = {
    '--primary-color': primaryColor,
    '--font-sans': fontVarValue,
  } as React.CSSProperties;

  return (
    <div
      style={wrapperStyle}
      className={`${fontClass} min-h-screen bg-background text-foreground font-sans transition-colors duration-300`}
    >
      {children}
    </div>
  );
}
