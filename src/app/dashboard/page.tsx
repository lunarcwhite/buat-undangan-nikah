'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut, LayoutDashboard, User } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
      } else {
        setUserEmail(user.email || '');
      }
      setIsLoading(false);
    }
    checkUser();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20">
      {/* Header bar */}
      <header className="bg-card border-b border-muted py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-primary font-extrabold text-lg">
          <LayoutDashboard className="w-6 h-6" />
          Wedding Planner Dashboard
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 hover:bg-muted text-muted-foreground hover:text-foreground font-semibold py-2 px-4 rounded-lg transition text-sm cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </header>

      {/* Main dashboard content */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-card border border-muted p-8 rounded-2xl shadow-sm mb-6 flex items-center gap-4">
          <div className="bg-primary/10 p-4 rounded-full text-primary">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Welcome back!</h2>
            <p className="text-sm text-muted-foreground mt-1">Logged in as {userEmail}</p>
          </div>
        </div>

        <div className="bg-card border border-muted p-8 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold mb-3">Your Invitations</h3>
          <p className="text-sm text-muted-foreground">
            Feature to create and edit invitations will be available in Phase 3.
          </p>
        </div>
      </div>
    </main>
  );
}
