'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, Search, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

interface RSVP {
  id: string;
  name: string;
  status: string; // 'attending' | 'declined' | 'tentative'
  guests_count: number;
  created_at: string;
}

export default function RSVPListPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined' | 'tentative'>('all');
  const [coupleNames, setCoupleNames] = useState('');

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Check invitation owner and fetch names
      const { data: invite, error: inviteErr } = await supabase
        .from('invitations')
        .select('content_data')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (inviteErr || !invite) {
        console.error('Unauthorized or invalid invitation ID');
        router.push('/dashboard');
        return;
      }

      const bride = invite.content_data?.bride_name || 'Bride';
      const groom = invite.content_data?.groom_name || 'Groom';
      setCoupleNames(`${bride} & ${groom}`);

      // Fetch RSVPs
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('invitation_id', id)
        .order('created_at', { ascending: false });

      if (data) {
        setRsvps(data);
      }
      setIsLoading(false);
    }

    loadData();
  }, [id, router, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Calculate stats
  const totalResponses = rsvps.length;
  const totalAttendingGuests = rsvps
    .filter((r) => r.status === 'attending')
    .reduce((sum, r) => sum + r.guests_count, 0);
  const totalDeclined = rsvps.filter((r) => r.status === 'declined').length;

  // Filter list
  const filteredRsvps = rsvps.filter((rsvp) => {
    const matchesSearch = rsvp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rsvp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/dashboard"
            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 p-2.5 rounded-xl transition text-slate-400 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">RSVP Registry</h2>
            <p className="text-sm text-slate-400 mt-0.5">Invitation: <span className="text-amber-500 font-medium">{coupleNames}</span></p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="bg-slate-800 p-3 rounded-xl text-slate-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{totalResponses}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Total RSVPs</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400 border border-emerald-500/15">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">{totalAttendingGuests}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Attending Guests</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="bg-rose-500/10 p-3 rounded-xl text-rose-400 border border-rose-500/15">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-rose-400">{totalDeclined}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Declined</div>
            </div>
          </div>
        </div>

        {/* Filter controls panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search guest name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 w-full md:w-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex-1 md:flex-none py-1.5 px-4 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('attending')}
                className={`flex-1 md:flex-none py-1.5 px-4 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'attending' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Attending
              </button>
              <button
                onClick={() => setStatusFilter('declined')}
                className={`flex-1 md:flex-none py-1.5 px-4 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'declined' ? 'bg-rose-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Declined
              </button>
              <button
                onClick={() => setStatusFilter('tentative')}
                className={`flex-1 md:flex-none py-1.5 px-4 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'tentative' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tentative
              </button>
            </div>
          </div>

          {/* Log Table */}
          {filteredRsvps.length === 0 ? (
            <div className="text-center py-12 text-slate-400 border border-dashed border-slate-800 rounded-2xl text-sm">
              No matching RSVP logs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-4 pt-2">Guest Name</th>
                    <th className="pb-4 pt-2">Attendance Status</th>
                    <th className="pb-4 pt-2 text-center">Party Size</th>
                    <th className="pb-4 pt-2 text-right">Date Responded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredRsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="text-slate-300 hover:text-white">
                      <td className="py-4 font-semibold">{rsvp.name}</td>
                      <td className="py-4">
                        {rsvp.status === 'attending' && (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                            <CheckCircle className="w-3 h-3" />
                            Attending
                          </span>
                        )}
                        {rsvp.status === 'declined' && (
                          <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                            <XCircle className="w-3 h-3" />
                            Declined
                          </span>
                        )}
                        {rsvp.status === 'tentative' && (
                          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                            <Clock className="w-3 h-3" />
                            Tentative
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-center font-medium">{rsvp.guests_count}</td>
                      <td className="py-4 text-right text-slate-400 text-xs font-mono">
                        {new Date(rsvp.created_at).toLocaleDateString(undefined, {
                          dateStyle: 'medium',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
