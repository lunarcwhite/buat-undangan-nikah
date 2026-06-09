import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Smartphone, Music, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Header / Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Heart className="w-5 h-5 text-slate-950 fill-slate-950" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent">
            RoyalInvite
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-350 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-5 rounded-full text-sm transition shadow-lg shadow-amber-500/15"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-semibold mb-8">
          <Sparkles className="w-4 h-4" />
          Create premium invitations in 5 minutes
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mb-6 font-serif">
          Create Elegant, Personalized{' '}
          <span className="bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent">
            Digital Wedding Invitations
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Design beautiful, mobile-responsive invitations with dynamic themes, photo galleries, background music, and real-time RSVP log trackers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full justify-center max-w-md">
          <Link
            href="/register"
            className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-slate-950 font-bold py-4 px-8 rounded-2xl transition transform hover:-translate-y-0.5 shadow-xl shadow-amber-500/10 text-center"
          >
            Start For Free
          </Link>
          <Link
            href="/login"
            className="flex-1 bg-slate-900 hover:bg-slate-850 text-white font-semibold py-4 px-8 rounded-2xl transition border border-slate-850 text-center"
          >
            Manage Invitations
          </Link>
        </div>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left pt-12 border-t border-slate-900">
          <div className="bg-slate-900/50 border border-slate-900 p-8 rounded-3xl backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mobile Responsive</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Designed first for mobile viewports, providing a smooth and premium scrolling experience for your guests.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-900 p-8 rounded-3xl backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Audio Soundtrack</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enable romantic preset loops or direct MP3 custom audio tracks with elegant mute/play overlay triggers.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-900 p-8 rounded-3xl backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Real-time RSVPs</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Manage your guest wishes and attendance confirmation lists instantly via your dashboard logs.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 text-center text-xs text-slate-500 border-t border-slate-900">
        <p>© 2026 RoyalInvite. All rights reserved.</p>
      </footer>
    </div>
  );
}
