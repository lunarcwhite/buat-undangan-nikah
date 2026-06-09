'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function NewInvitationPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function createInvitation() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const defaultContent = {
        bride_name: 'Bride Name',
        groom_name: 'Groom Name',
        event_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T18:00', // 90 days out
        location_name: 'Grand Ballroom, Plaza Hall',
        location_link: 'https://maps.google.com',
      };

      const defaultTheme = {
        primary_color: '#f59e0b', // Amber
        background_color: '#0f172a', // Dark slate
        font_family: 'Playfair Display',
      };

      // Generate a unique, simple random slug
      const randomId = Math.random().toString(36).substring(2, 8);
      const initialSlug = `wedding-${randomId}`;

      const { data, error } = await supabase
        .from('invitations')
        .insert({
          slug: initialSlug,
          content_data: defaultContent,
          theme_config: defaultTheme,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating invitation:', error);
        router.push('/dashboard');
      } else if (data) {
        router.push(`/dashboard/invitations/${data.id}/edit`);
      }
    }

    createInvitation();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      <p className="text-sm text-slate-400 font-medium">Creating your new invitation...</p>
    </div>
  );
}
