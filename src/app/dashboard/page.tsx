'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, LogOut, LayoutDashboard, User, Plus, Edit, Users, ExternalLink, Calendar, MapPin } from 'lucide-react';

interface Invitation {
  id: string;
  slug: string;
  content_data: {
    bride_name?: string;
    groom_name?: string;
    event_date?: string;
    location_name?: string;
  };
  theme_config: {
    primary_color?: string;
  };
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUserEmail(user.email || '');
      setUserId(user.id);

      // Fetch invitations
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setInvitations(data);
      }
      setIsLoading(false);
    }
    fetchDashboardData();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 to-black">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header bar */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 text-amber-500 font-extrabold text-xl tracking-tight">
          <LayoutDashboard className="w-6 h-6" />
          Royal Invite
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium py-2 px-4 rounded-xl transition text-sm cursor-pointer border border-slate-700"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </header>

      {/* Main dashboard content */}
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        <div className="bg-gradient-to-r from-amber-500/10 to-amber-950/20 border border-amber-500/20 p-6 md:p-8 rounded-3xl shadow-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/15 p-4 rounded-2xl text-amber-500">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h2>
              <p className="text-sm text-slate-400 mt-1">Logged in as <span className="text-amber-500 font-medium">{userEmail}</span></p>
            </div>
          </div>

          <Link
            href="/dashboard/invitations/new"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold py-3 px-6 rounded-2xl transition shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50 text-sm"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            New Invitation
          </Link>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-6">Your Wedding Invitations</h3>

          {invitations.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center flex flex-col items-center max-w-lg mx-auto">
              <div className="bg-slate-800/50 p-6 rounded-full text-slate-500 mb-4">
                <LayoutDashboard className="w-12 h-12" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">No invitations found</h4>
              <p className="text-sm text-slate-400 mb-6 max-w-sm">
                Get started by creating your first wedding invitation. You can customize the couple's details, pick custom colors, and track RSVPs.
              </p>
              <Link
                href="/dashboard/invitations/new"
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-650 text-amber-500 font-bold py-3 px-6 rounded-2xl transition border border-amber-500/20 cursor-pointer text-sm"
              >
                <Plus className="w-4 h-4" />
                Create First Invitation
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {invitations.map((invite) => {
                const bride = invite.content_data?.bride_name || 'Bride';
                const groom = invite.content_data?.groom_name || 'Groom';
                const date = invite.content_data?.event_date ? new Date(invite.content_data.event_date).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Date TBD';
                const location = invite.content_data?.location_name || 'Location TBD';

                return (
                  <div
                    key={invite.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <h4 className="text-lg font-extrabold text-white tracking-tight">
                          {bride} & {groom}
                        </h4>
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
                          /{invite.slug}
                        </span>
                      </div>

                      <div className="space-y-2 text-slate-400 text-sm mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-500/70" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-amber-500/70" />
                          <span className="truncate">{location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800">
                      <Link
                        href={`/dashboard/invitations/${invite.id}/edit`}
                        className="inline-flex items-center justify-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold py-2 px-3 rounded-xl transition text-xs border border-amber-500/20 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Customize
                      </Link>
                      <Link
                        href={`/dashboard/invitations/${invite.id}/rsvps`}
                        className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-3 rounded-xl transition text-xs border border-slate-750 cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5 text-amber-500/70" />
                        RSVPs
                      </Link>
                      <a
                        href={`/${invite.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-3 rounded-xl transition text-xs border border-slate-750 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-500/70" />
                        View Live
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

